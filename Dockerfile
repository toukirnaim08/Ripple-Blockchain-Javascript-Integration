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
RUN ln -f -s .env.dev .env \
    && npm install

USER root

# Add project files
COPY --chown=${APP_USER}:${APP_USER} . ./

USER ${APP_USER}

EXPOSE 5130

# Define entrypoint
ENTRYPOINT [ "npm", "run", "docker" ]
