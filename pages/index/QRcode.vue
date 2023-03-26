<template>
  <div class="QRcode">
    <div class="code">
      <div class="time">{{ realTime }}</div>
      <div class="qrcode" v-if="qrcodeText">
        <TkiQrcode
          :loadMake="true"
          :val="qrcodeText"
          foreground="#000"
          pdground="#000"
        />
      </div>
      <div class="qrcode" v-else>
        <img class="qrcode-img" mode="widthFix" :src="IMG.noCode" alt="" />
      </div>
      <div class="bottom">扫一扫上面的二维码，了解他的个人信息</div>
    </div>
  </div>
</template>

<script>
import { IMG } from "../../utils/index";
import TkiQrcode from "../../components/tki-qrcode.vue";
export default {
  components: {
    TkiQrcode,
  },
  data() {
    return {
      IMG: IMG,
      qrcodeText: "",
      realTime: "",
    };
  },
  created() {
    const familyIds = this.$store.state.familyIds;
    if (familyIds != 0) {
      const familyAgentList = this.$store.state.familyAgentList;
      const tempIndex = familyAgentList.findIndex(
        (ele) => ele.ids === familyIds
      );
      if (tempIndex !== -1) {
        this.qrcodeText =
          "http://127.0.0.1/health?yymString=" + familyAgentList[tempIndex].ids;
      }
    } else {
      this.qrcodeText =
        "http://127.0.0.1/health?yymString=" + this.$store.state.qyMemberIds;
    }
    console.log(this.qrcodeText);
  },
  mounted() {
    // 页面加载完后显示当前时间
    this.realTime = this.dealWithTime(new Date());
    // 定时刷新时间
    const _this = this;
    // 定时器
    this.timer = setInterval(function () {
      _this.realTime = _this.dealWithTime(new Date());
    }, 1000); // 修改日期格式
  },
  methods: {
    // 创建日期时间
    dealWithTime(data) {
      let formatDateTime = null;
      const Y = data.getFullYear();
      let M = data.getMonth() + 1;
      let D = data.getDate();
      let H = data.getHours();
      let Min = data.getMinutes();
      let S = data.getSeconds();
      M = M < 10 ? "0" + M : M;
      D = D < 10 ? "0" + D : D;
      H = H < 10 ? "0" + H : H;
      Min = Min < 10 ? "0" + Min : Min;
      S = S < 10 ? "0" + S : S;
      formatDateTime = M + "月" + D + "日  " + H + ":" + Min + ":" + S;
      return formatDateTime;
    },
  },
};
</script>

<style scoped lang="less">
.QRcode {
  width: 100vw;
  height: 100vh;
  display: flex;

  justify-content: center;
  background-color: #eee;
  .code {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 54rpx;
    background-color: #fff;
    border-radius: 20rpx;
    margin-top: 10vh;
    height: 600rpx;
    .time {
      font-size: 34rpx;
      font-size: 500;
    }

    .qrcode {
      margin: 54rpx 0;
      height: 400rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .qrcode-img {
        width: 70%;
        height: 70%;
      }
    }
    .bottom {
      font-size: 28rpx;
      color: #666;
    }
  }
}
</style>