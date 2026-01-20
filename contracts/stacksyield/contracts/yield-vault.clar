;; StacksYield Vault Contract
;; Manages USDCx deposits and yield tracking

;; Define constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))
(define-constant err-invalid-amount (err u102))
(define-constant err-position-not-found (err u103))

;; Define data maps
(define-map user-positions
  { user: principal }
  {
    total-deposited: uint,
    last-update: uint,
    protocol-id: (string-ascii 50)
  }
)

(define-map protocol-stats
  { protocol-id: (string-ascii 50) }
  {
    total-tvl: uint,
    current-apy: uint,
    user-count: uint
  }
)

;; Define data vars
(define-data-var total-value-locked uint u0)
(define-data-var contract-paused bool false)

;; Read-only functions

(define-read-only (get-user-position (user principal))
  (map-get? user-positions { user: user })
)

(define-read-only (get-protocol-stats (protocol-id (string-ascii 50)))
  (map-get? protocol-stats { protocol-id: protocol-id })
)

(define-read-only (get-total-tvl)
  (ok (var-get total-value-locked))
)

(define-read-only (is-paused)
  (ok (var-get contract-paused))
)

(define-read-only (calculate-yield (user principal))
  (let
    (
      (position (unwrap! (get-user-position user) (err err-position-not-found)))
      (blocks-since-update (- block-height (get last-update position)))
      ;; Simplified yield calculation (in production, use more accurate formulas)
      (estimated-yield (/ (* (get total-deposited position) blocks-since-update) u100000))
    )
    (ok estimated-yield)
  )
)

;; Public functions

(define-public (deposit (amount uint) (protocol-id (string-ascii 50)))
  (let
    (
      (user tx-sender)
      (current-position (default-to
        { total-deposited: u0, last-update: block-height, protocol-id: protocol-id }
        (get-user-position user)
      ))
    )
    (asserts! (not (var-get contract-paused)) (err u999))
    (asserts! (> amount u0) err-invalid-amount)

    ;; Update user position
    (map-set user-positions
      { user: user }
      {
        total-deposited: (+ (get total-deposited current-position) amount),
        last-update: block-height,
        protocol-id: protocol-id
      }
    )

    ;; Update total TVL
    (var-set total-value-locked (+ (var-get total-value-locked) amount))

    ;; Update protocol stats
    (let
      (
        (current-stats (default-to
          { total-tvl: u0, current-apy: u850, user-count: u0 }
          (get-protocol-stats protocol-id)
        ))
      )
      (map-set protocol-stats
        { protocol-id: protocol-id }
        {
          total-tvl: (+ (get total-tvl current-stats) amount),
          current-apy: (get current-apy current-stats),
          user-count: (+ (get user-count current-stats) u1)
        }
      )
    )

    (ok true)
  )
)

(define-public (withdraw (amount uint))
  (let
    (
      (user tx-sender)
      (position (unwrap! (get-user-position user) err-position-not-found))
    )
    (asserts! (not (var-get contract-paused)) (err u999))
    (asserts! (>= (get total-deposited position) amount) err-not-enough-balance)
    (asserts! (> amount u0) err-invalid-amount)

    ;; Update user position
    (map-set user-positions
      { user: user }
      {
        total-deposited: (- (get total-deposited position) amount),
        last-update: block-height,
        protocol-id: (get protocol-id position)
      }
    )

    ;; Update total TVL
    (var-set total-value-locked (- (var-get total-value-locked) amount))

    ;; Update protocol stats
    (let
      (
        (protocol-id (get protocol-id position))
        (current-stats (unwrap! (get-protocol-stats protocol-id) (err u104)))
      )
      (map-set protocol-stats
        { protocol-id: protocol-id }
        {
          total-tvl: (- (get total-tvl current-stats) amount),
          current-apy: (get current-apy current-stats),
          user-count: (get user-count current-stats)
        }
      )
    )

    (ok true)
  )
)

;; Admin functions

(define-public (pause-contract)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set contract-paused true)
    (ok true)
  )
)

(define-public (unpause-contract)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set contract-paused false)
    (ok true)
  )
)

(define-public (update-protocol-apy (protocol-id (string-ascii 50)) (new-apy uint))
  (let
    (
      (current-stats (unwrap! (get-protocol-stats protocol-id) (err u104)))
    )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)

    (map-set protocol-stats
      { protocol-id: protocol-id }
      {
        total-tvl: (get total-tvl current-stats),
        current-apy: new-apy,
        user-count: (get user-count current-stats)
      }
    )
    (ok true)
  )
)
