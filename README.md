# Dixit

Transforming the popular storytelling board game into its online version.

# Tech
Dixit uses a number of open source projects to work properly:

* [Angular] - One framework. Mobile & desktop.
* [Firebase] - Store and sync app data at global scale & Hosting.

And of course Dixit itself is open source with a [public repository][avkrastev] on GitHub.

# Installation

You should install [Angular Framework](https://angular.io/guide/setup-local) locally.
Then you need to setup the your own [Firebase configuration](https://firebase.google.com/docs/web/setup).

After that you have to put the configuration in `src/environments/environment.ts`. You have to create such file if it is missing.
It should look like this:

```
export const environment = {
  production: false,
  firebase: {
    apiKey: "api-key",
    authDomain: "project-id.firebaseapp.com",
    databaseURL: "https://project-id.firebaseio.com",
    projectId: "project-id",
    storageBucket: "project-id.appspot.com",
    messagingSenderId: "sender-id",
    appId: "app-id",
    measurementId: "G-measurement-id",
  }
};
```

Then we are ready to build the project.

```
$ ng build --prod
```

After successfull buidl we will have a new directory under `dist` folder. And we are ready now for deployment.

## Deploy

First, we need to go to [Firebase CLI](https://firebase.google.com/docs/cli) and install firebase-tools package.

Then, we have to login via the command line.

```
$ firebase login
```
```
$ firebase init
```
Choose, **Hosting: Configure and deploy Firebase Hosting sites** (by clicking the space button and then Enter).
> What do you want to use as your public directory? (public)

Here you type `dist/dixit`.

> Configure as a single-page app (rewrite all urls to /index.html)?

Yes.

> File dist/dixit/index.html already exists. Overwrite?

No.

```
$ firebase deploy
```

You should have now you own deployment of Dixit!

# License

GNU GPL

 [avkrastev]: <https://github.com/avkrastev/dixit>
 [Angular]: <https://angular.io/>
 [Firebase]: <https://firebase.google.com/>
