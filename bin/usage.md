Usage: enom-dyndns [options]

Checks if dynamic IP address has changed and updates enom Dynamic DNS record if necessary.

Options:
  -d, --domain DOMAIN        domain name to update [REQUIRED]
  -p, --password PASSWORD    enom password [REQUIRED]
  --hostname HOSTNAME        domain hostname [defaults to '*']
  -c, --check                only check if IP address has changed
  -f, --force                force update record
  -h, --help                 this help message
