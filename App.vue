<script>
import { useSystemStore } from "@/store/system";

export default {
  onLaunch: function () {
    const systemStore = useSystemStore();
    console.log("App Launch");
    systemStore.setSystem();
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style>
/*每个页面公共css */
@import "@/styles/base.scss";
@import "@/styles/iconfont.scss";
@import "@/styles/font.scss";
</style>
