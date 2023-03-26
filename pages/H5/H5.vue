<!--
 * @Author: jayshawww
 * @Date: 2022-03-26 15:52:44
 * @LastEditTime: 2022-03-27 16:55:07
 * @LastEditors: your name
 * @FilePath: \yanyima\pages\H5\H5.vue
-->
<template>
  <div class="h5">
    <web-view :src="url"></web-view>
  </div>
</template>
<script>
import { baseUrl } from '../../utils'
export default {
  name: 'H5',
  data() {
    return {
      url: '',
    }
  },
  methods: {
    onLoad(options) {
      console.log(options, 'H5**************')
      this.url =
        baseUrl +
        '/manager/auth/cookie/to/redirect?qy_ids=qj2oyprw8rwm076&mids=' +
        this.$store.state.qyMemberIds +
        '&red_url=' +
        encodeURIComponent(options.url)
      console.log(this.url, 'url**********')
    },
  },
}
</script>
<style lang="less" scoped></style>
