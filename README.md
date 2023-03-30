# Initial setup for local dev environment

This repo contains VSCode setting files for smoother Drupal development.
PHP Sniffer & Beautifier extension will utilize phpcs and phpcbf within lando's container to lint on file save and beautify it if configured.

## Prerequisites
* Download and created a fresh Drupal directory following [Drupal.org](https://www.drupal.org/download) directions.
* Install [Lando](https://docs.lando.dev/getting-started/installation.html)
* Install [VSCode](https://code.visualstudio.com/Download)

```sh
# Create project with composer demo
composer create-project drupal/recommended-project [project_name] 
```

## What's within

```sh
starter-template
  - .vscode/ #vscode workspace settings
    -- bin/ # Allows IDE to execute binary within lando container
      --- php #vscode exec php binary from container
      --- phpcbf #vscode exec phpcbf binary from container
      --- phpcs #vscode exec phpcs binary from container

    -- launch.json #vscode debugger
    -- php.ini #lando https://docs.lando.dev/guides/lando-with-vscode.html
    -- settings.json #vscode override settings for extensions by project

  - .lando.yml #lando base config file for lando dev environment
  - settings.local.php #drupal should be replaced/override according to personal setup.
```

## How to use

* Copy *.vscode* directory to *[project_name]* folder.
  ```sh
  cp -r starter-template/.vscode [project_name]/.
  ```

* Copy *.lando.yml* file to *[project_name]* if file doesn't exist.
  ```sh
  cp starter-template/.lando.yml [project_name]/.
  ```

* Copy *settings.local.php* to [project_name]/web/sites/default/ and make sure last few lines of *settings.php* has been uncommented to allow local override.
  ```php
  # Uncomment these few lines in settings.php
  
  # if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  #   include $app_root . '/' . $site_path . '/settings.local.php';
  # }
  ```
  ```sh
  cp starter-template/.settings.local.php [project_name]/web/sites/default/.
  ```

* Rewrite contents of *.lando.yml* to fit your Drupal project.
* Run `lando start` at project root.
  ```sh
  cd [project_name]
  lando start
  ```

## What are these?

### Settings.json

>VS Code provides several different scopes for settings. When you open a workspace, you will see at least the following two scopes:
>
>*User Settings* - Settings that apply globally to any instance of VS Code you open.<br>
*Workspace Settings* - Settings stored inside your workspace and only apply when the workspace is opened.
>
> -- [VSCode - User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)

Install the following `extensions` to work with *settings.json*

* [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
* [PHP Debug](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug)
* [PHP DocBlocker](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker)
* [PHP Sniffer & Beautifier](https://marketplace.visualstudio.com/items?itemName=ValeryanM.vscode-phpsab)

```json
{
  "php.validate.executablePath": ".vscode/bin/php",
  "php.debug.executablePath": ".vscode/bin/php",
  "intelephense.environment.documentRoot": "web", // check .lando.yml
  "intelephense.environment.phpVersion": "8.1.0", // check .lando.yml
  "phpsab.executablePathCBF": ".vscode/bin/phpcbf",
  "phpsab.executablePathCS": ".vscode/bin/phpcs",
  "phpsab.fixerArguments": [
    "--colors",
    "--extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml",
    "--ignore=node_modules,bower_components,vendor,css"
  ],
  "phpsab.snifferArguments": [
    "--colors",
    "--extensions=php,module,inc,install,test,profile,theme,css,info,txt,md,yml",
    "--ignore=node_modules,bower_components,vendor,css"
  ],
  "phpsab.standard": "Drupal,DrupalPractice"
}
```

### .lando.yml

```yaml
name: [project_name] # project name
recipe: drupal9 # https://docs.lando.dev/config/recipes.html
config: # https://docs.lando.dev/drupal/config.html
  webroot: web # relative location of index.php from [project_root]
  xdebug: true # xdebug on lando start
  php: '8.1' # PHP version
  config: # override container settings
    php: .vscode/php.ini # override php.ini
keys: # https://docs.lando.dev/core/v3/ssh.html#ssh-keys
  - key_to_load.key
# services: uncomment and run `lando rebuild -y` for phpmyadmin service
  # pma:
  #   type: phpmyadmin
  #   hosts:
  #     - database
proxy: # https://docs.lando.dev/core/v3/proxy.html#usage
  appserver:
    - [project_name].lndo.site
  # pma:
  #   - pma-ed9.lndo.site
tooling: # custom command for lando env
  # This allows usage of `lando drush cr`
  drush:
    service: appserver
    env:
      DRUSH_OPTIONS_URI: "https://[project_name].lndo.site"

```