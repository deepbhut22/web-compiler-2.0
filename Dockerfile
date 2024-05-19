FROM alpine:latest

RUN apk update && apk upgrade && \
    apk add --no-cache \
    build-base \
    openjdk11-jdk \
    python3 \
    py3-pip \
    nodejs \
    npm \
    && rm -rf /var/cache/apk/*

ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"
    
RUN gcc --version && \
    g++ --version && \     
    javac -version && \
    python3 --version && \
    node --version && \
    npm --version

    WORKDIR /usr/src/app

    # Copy the application code to the container
    COPY . .

    RUN npm install
    
    # Start the application
    CMD ["node", "index.js"]