# Welcome to Remix Chat!

## Stack Details

This application is deployed on on the edge via [Cloudflare Pages](https://developers.cloudflare.com/pages/) built with:

- [Remix](https://remix.run/docs)
- [chatscope](https://chatscope.io/)
- [dicebear](https://www.dicebear.com/)

## Development

To run the application locally, you should use the `wrangler` CLI so you can leverage the Cloudflare runtime. This is already wired up in the package.json as the `dev` script:

```sh
# start the remix dev server and wrangler
yarn run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Building the Application

In order to create a static build of your application run:

```sh
yarn run build
```

and the `/public` directory will have all your ouputs.

## Deployment

Before deploying ensure you have a [Cloudflare account setup & email verified](https://dash.cloudflare.com/sign-up/pages).

### Web Application

To deploy the web application you can use the wrangler CLI:

```sh
yarn run pages:deploy
```

or you can use the Git provider integration on the Cloudflare dashboard and configure your build options.

### Worker


