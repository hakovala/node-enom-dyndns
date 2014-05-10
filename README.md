## eNom-DynDNS

Check that your domain is pointing to your current ip address. If it's not then update eNom Dynamic DNS record.

[More information about eNom Dynamic DNS can be found here](http://www.enom.com/help/faq_dynamicdns.asp)

### Installation
Install globally

    npm install -g enom-dyndns

### Usage
    enom-dyndns [options]

Available options:
```
  -d, --domain DOMAIN        domain name to update [REQUIRED]
  -p, --password PASSWORD    enom password [REQUIRED]
  --hostname HOSTNAME        domain hostname [defaults to '*']
  -c, --check                only check if IP address has changed
  -f, --force                force update record
  -h, --help                 this help message
```

Check and if changed update:

    enom-dyndns -d yourdomain.com -p password

Only check for changes:

    enom-dyndns -d yourdomain.com -c

Force update:

    enom-dyndns -d yourdomain.com -p password -f

Define hostname to update:

    enom-dyndns -d yourdomain.com -p password --hostname yourhostname
