config - confguration file
controller - business logic
middleware - custom middleware
models - mongo scheme
routes - api route definition
utility - utitlity helps - ai service helper or date
scripts - db seeding

<!-- for generating 64 byte random string and cnoverts into hexadecimal for JWT secret  -->
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"