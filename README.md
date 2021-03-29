# @lindorm-io/koa-keystore
Keystore middleware for @lindorm-io/koa applications.

## Installation
```shell script
npm install --save @lindorm-io/koa-keystore
```

### Peer Dependencies
This package has the following peer dependencies: 
* [@lindorm-io/koa](https://www.npmjs.com/package/@lindorm-io/koa)
* [@lindorm-io/winston](https://www.npmjs.com/package/@lindorm-io/winston)

## Usage

### Keystore Middleware connected to Mongo Repository
Ensure that the repository exists on your context, and then add the keystore middleware.

```typescript
koaApp.addMiddleware(keyPairRepositoryMiddleware);
koaApp.addMiddleware(keystoreMiddleware);
```

### Keystore Middleware with Redis Cache connected to Mongo Repository
Ensure that redis is continuously updated. Ensure that the cache exists on your context, and then add the keystore middleware. 

```typescript
koaApp.addWorker(keyPairMongoCacheWorker({
  mongoConnectionOptions: {
    auth: { user: "root", password: "example" },
    url: { host: "mongo.host", port: 27000 },
    databaseName: "database",
  },
  redisConnectionOptions: {
    port: 1000,
    type: RedisConnectionType.CACHE,
  },
  winston: winstonLogger,
  workerIntervalInSeconds: 60 * 60 // 60 minutes
}))
koaApp.addMiddleware(keyPairCacheMiddleware);
koaApp.addMiddleware(cachedKeystoreMiddleware);
```

### Keystore Middleware with Redis Cache connected to JWKS Handler
Ensure that redis is continuously updated. Ensure that the cache exists on your context, and then add the keystore middleware.

```typescript
koaApp.addWorker(keyPairJwksCacheWorker({
  jwksHost: "https://authentication.service",
  redisConnectionOptions: {
    port: 1000,
    type: RedisConnectionType.CACHE,
  },
  winston: winstonLogger,
  workerIntervalInSeconds: 60 * 60 // 60 minutes
}))
koaApp.addMiddleware(keyPairCacheMiddleware);
koaApp.addMiddleware(cachedKeystoreMiddleware);
```
