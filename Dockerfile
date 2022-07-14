FROM node:14

ARG APP_USER=sid

# Create workdir
WORKDIR /app

RUN useradd -m ${APP_USER} \
    && chown ${APP_USER}:${APP_USER} -R .

# Add dependencies files only (Normally dependencies do not change frequently so let's cache it)
COPY --chown=${APP_USER}:${APP_USER} package*.json ./

USER ${APP_USER}

# Install dependencies
RUN ln -f -s .env.prod .env \
    && npm install

USER root

# Add project files
COPY --chown=${APP_USER}:${APP_USER} . ./

USER ${APP_USER}

# Add git revision
ARG GIT_REVISION
ARG FULL_VERSION
ARG PACKAGE_NAME
LABEL GIT_REVISION=$GIT_REVISION
ENV GIT_REVISION=$GIT_REVISION

# DataDog Stuff
LABEL com.datadoghq.tags.service=$PACKAGE_NAME
LABEL com.datadoghq.tags.version=$FULL_VERSION
ENV DD_SERVICE=$PACKAGE_NAME
ENV DD_VERSION=$FULL_VERSION

# Define entrypoint
ENTRYPOINT [ "npm", "run", "docker" ]
