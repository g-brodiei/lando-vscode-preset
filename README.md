# 專案環境初始設定檔

```sh
starter-template
  - .vscode/
    -- bin/
      --- php #vscode 引用容器內php軟體的指令檔
      --- phpcbf #vscode 引用容器內phpcbf軟體的指令檔
      --- phpcs #vscode 引用容器內phpcs軟體的指令檔

    -- launch.json #vscode debugger 引用的設定檔
    -- php.ini #lando 調校容器內部php與php.xdebug的設定檔
    -- settings.json #vscode，

  - .lando.yml #lando 複製到各專案根目錄底下的lando環境設定檔
  - settings.local.php #drupal 應該複製到各Drupal專案的本地覆寫設定檔
```

## 使用方法

* .vscode 資料夾本身，請複製到專案資料夾最上層
  ```sh
  cp -r starter-template/.vscode silverbelld9/.
  ```

* .lando.yml 檔案，若專案資料夾內並無相同檔案的話，請複製一份到專案資料夾最上層
  ```sh
  cp starter-template/.lando.yml silverbelld9/.
  ```

* settings.local.php，請複製一份到 專案資料夾內以下相對位置 docroot/sites/default/.
  ```sh
  cp starter-template/.settings.local.php silverbelld9/docroot/sites/default/.
  ```

## 可修改的參數

### Settings.json

`settings.json` 檔是 VSCode 編輯器針對此專案資料夾的獨立設定檔。

以下設定所需安裝的 `extension`

* [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
* [PHP Debug](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug)
* [PHP DocBlocker](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker)
* [PHP Sniffer & Beautifier](https://marketplace.visualstudio.com/items?itemName=ValeryanM.vscode-phpsab)

```json
{
  "php.validate.executablePath": ".vscode/bin/php",
  "php.debug.executablePath": ".vscode/bin/php",
  "intelephense.environment.documentRoot": "docroot",
  "intelephense.environment.phpVersion": "8.1.0", // 根據專案版本做修正
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
name: silverbelld9 # 容器總稱
recipe: drupal9 # 所使用的環境基礎食譜 https://docs.lando.dev/config/recipes.html
config: # 修改食譜的參數 https://docs.lando.dev/drupal/config.html
  webroot: docroot # 網站資料夾 index.html 的位置
  xdebug: true # 是否預設開啟容器內的xdebug
  php: '7.4' # 容器所套用的PHP版本
  config: # 內部軟體覆寫設定檔
    php: .vscode/php.ini # 取用本地存於.vscode資料夾內的php.ini檔案作為參數
keys: # 於容器建立時自動載入的金鑰詳列於此
  - develop_server.key
# services: 若需要開啟phpmyadmin 的服務，請uncomment相關行數並 lando rebuild -y
  # pma:
  #   type: phpmyadmin
  #   hosts:
  #     - database
proxy: # 各容器的對本地用網址名稱
  appserver:
    - silverbelld9.lndo.site
  # pma:
  #   - pma-ed9.lndo.site
tooling: # 專案下的客製化指令 可透過前綴指令 lando 來使用。Ex: lando dreset
  drush:
    service: appserver
    env:
      DRUSH_OPTIONS_URI: "https://silverbelld9.lndo.site"

```