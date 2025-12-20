FROM judge0/judge0-base:1.0.0

WORKDIR /usr/src/api

# Clone Judge0 source
RUN git clone --depth 1 --branch v1.13.1 https://github.com/judge0/judge0.git . && \
    bundle install && \
    rm -rf .git

EXPOSE 2358

CMD ["./scripts/server"]
