### Description ### 

> CA API Gateway v9.3 docker project with OTK 4.2 installed while lunching

### Pre- requisite ###
> Please give your docker at least 6G RAM in order to run this project smoothly. Otherwise OTK installation might be incomplete due to insufficient memory.

### Usage ###

#### Job #1: start the gateway with OTK installed
##### Step1: Copy your gateway license to ./config/ and rename it to SSG_LICENSE.xml

##### Step2: Start the gateway
> `# docker-compose up --build`

##### Step3: Waiting until OTK intallation completed successfully
> You will see something like down below from the console, means your gateway started and OTK installation was successful. Note that the gateway will be restarted as part of the customization after otk installation.

> > api-gateway_1  | Gateway not started yet, keep waiting...

> > api-gateway_1  | Gateway not started yet, keep waiting...

> > api-gateway_1  | Gateway started. Continuing.

> > api-gateway_1  | Installing OTK in background...

> > api-gateway_1  | JDBC connection created for OTK installation. Continuing.

> > api-gateway_1  | Cassandra connection created for OTK installation. Continuing.

> > api-gateway_1  | HTTP/1.1 100 Continue

> > api-gateway_1  | 

> > api-gateway_1  | HTTP/1.1 200 OK

> > api-gateway_1  | Server: Apache-Coyote/1.1

> > api-gateway_1  | Content-Type: text/plain

> > api-gateway_1  | Content-Length: 32

> > api-gateway_1  | Date: Sat, 13 Jan 2018 00:28:58 GMT

> > api-gateway_1  | 

> > api-gateway_1  | Request completed successfully.

> > api-gateway_1  | OTK installed successfully. Done.


#### Job #2: clean up and start all over from scratch
> `# docker-compose down --volume; rm -rf data`

> `# docker images | grep otk42` 

> `# rmi DOCKER_IMAGE_ID`


> This command set will give you a clean start from scratch.
