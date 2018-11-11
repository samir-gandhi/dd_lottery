FROM caapim/gateway:9.3.00

# If one bundle is dependent on another, make sure that the dependent loads later
# The load order is based on the bundle filename following the ASCII sort order
# e.g. a.bundle will load before b.bundle
# ADD ./bundles/*.bundle /opt/SecureSpan/Gateway/node/default/etc/bootstrap/bundle/

# To use loading QuickStart services from JSON files, please change to
# SCALER_ENABLE: "false" and uncomment the following line
# ADD ./services/internal/*.json /opt/SecureSpan/Gateway/node/default/etc/bootstrap/qs/

ADD ./OTK_Installers/SolutionKit /root/OTK_Installers
ADD ./bundles/*.xml /opt/docker/rc.d/base/
ADD ./entrypoint.sh /opt/docker/entrypoint.sh
 
ENV OTK_DATABASE_USER=otk_user
ENV OTK_DATABASE_PASSWORD=7layer
ENV OTK_DATABASE_JDBC_URL=jdbc:mysql://mysql-otk:3306/otk_db 

ENV OTK_CASSANDRA_KEYSPACE=otk_db
ENV OTK_CASSANDRA_CONTACTPOINT=mysql-otk
ENV OTK_CASSANDRA_PORT=3306
 
