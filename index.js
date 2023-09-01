const fs = require('fs');
const yaml = require('js-yaml');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the YAML content with placeholders for replacements
const yamlContent = `
socks-port: 7890
external-controller: 127.0.0.1:9090
profile:
  store-selected: true
  store-fake-ip: true
proxies:
  - name: "zoom"
    type: vmess
    server: REPLACE_SERVER
    port: REPLACE_PORT
    uuid: REPLACE_UUID
    cipher: auto
    alterId: 0
    udp: true
    tls: true
    skip-cert-verify: true
    servername: google.zoom.us
    network: h2
    http-opts:
      path:
        - "/"
  - name: "MZero"
    type: vmess
    server: REPLACE_SERVER
    port: REPLACE_PORT
    uuid: REPLACE_UUID
    cipher: auto
    alterId: 0
    udp: true
    tls: true
    skip-cert-verify: true
    servername: media-exp1.licdn.com
    network: h2
    http-opts:
      path:
        - "/"
  - name: "Steam"
    type: vmess
    server: REPLACE_SERVER
    port: REPLACE_PORT
    uuid: REPLACE_UUID
    cipher: auto
    alterId: 0
    udp: true
    tls: true
    skip-cert-verify: true
    servername: google2.cdn.steampipe.steamcontent.com
    network: h2
    http-opts:
      path:
        - "/"
dns:
  enable: true
  ipv6: false
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - 192.168.8.1
tun:
  enable: true
  stack: gvisor
  dns-hijack:
    - 198.18.0.2:53
  auto-detect-interface: true
  auto-route: true
mode: global
log-level: info
allow-lan: false
ipv6: false
`;

// Read the YAML content
const config = yaml.load(yamlContent, { strict: false });

// Get user input for replacements
rl.question('Enter new server value: ', (server) => {
  rl.question('Enter new port value (without quotes): ', (port) => {
    rl.question('Enter new uuid value: ', (uuid) => {
      rl.question('Enter a unique name: ', (uniqueName) => {
        rl.close();

        // Replace placeholders with user input
        // config.socks_port = Number(port); // Convert port to a number
        // config.external_controller = server;

        config.proxies.forEach((proxy) => {
          proxy.server = server;
          proxy.port = Number(port); // Convert port to a number
          proxy.uuid = uuid;
        });

        // Create a unique output file name based on servername and name
        const servername = config.proxies[0].server || 'unknown';
        const outputFileName = `${servername}_${uniqueName}.yaml`;

        // Save the updated config to the new YAML file
        const yamlOptions = { noQuotes: true }; // Prevent quotes around values
        fs.writeFile(outputFileName, yaml.dump(config, yamlOptions), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`YAML configuration saved to ${outputFileName}`);
        });
      });
    });
  });
});
