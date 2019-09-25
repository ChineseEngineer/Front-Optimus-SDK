# Optimus-sdk

## install
```bash
npm i optimus-sdk
or
yarn add optimus-sdk

```

## use
```js
import optimus from 'optimus-sdk'
Vue.use(optimus)
```

## vue
````vue
export default {
  mounted () {
    this.$op.close() // 关闭webview
  }
}
````
