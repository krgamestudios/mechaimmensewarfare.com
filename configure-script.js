//setup
const readline = require('readline');
const fs = require('fs');
const crypto = require("crypto");

const uuid = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

//manually promisify this (util didn't work)
const question = (prompt, def = null) => {
	return new Promise((resolve, reject) => {
		rl.question(`${prompt}${def ? ` (${def})` : ''}: `, answer => {
			//loop on required
			if (def === null && !answer) {
				return resolve(question(prompt, def));
			}

			return resolve(answer || def);
		});
	});
};

//questions
(async () => {
	//app configuration
	const appName = await question('App Name');
	const webAddr = await question('Web Addr');

	//generate the files
	const ymlfile = `
version: "3.6"

services:
  ${appName}:
    container_name: ${appName}
    build: .
    volumes:
      - static_volume:/app/public

  nginx:
    image: nginx
    container_name: ${appName}-nginx
    restart: always
    volumes:
      - ./traefik-files:/etc/nginx/conf.d
      - static_volume:/static
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${appName}router.rule=Host(\`${webAddr}\`)"
      - "traefik.http.routers.${appName}router.entrypoints=websecure"
      - "traefik.http.routers.${appName}router.tls.certresolver=myresolver"
      - "traefik.http.routers.${appName}router.service=${appName}service@docker"
      - "traefik.http.services.${appName}service.loadbalancer.server.port=3000"
    networks:
      - traefik-network

volumes:
  static_volume:
    driver: local

networks:
  traefik-network:
    external: true
`;

	fs.writeFileSync('docker-compose.yml', ymlfile);
})()
	.then(() => rl.close())
	.catch(e => console.error(e))
;
