<template>
  <div>
    <!-- 上传控件 -->
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { server_URL } from "@/utils/urlConfig.js";
export default {
  props: ["value"],
  computed: {
    imageUrl() {
      if (this.value) {
        if (!this.value.includes(server_URL)) {
          return server_URL + this.value;
        }
        return this.value;
      }
    },
    headers() {
      return {
        // 本接口需要授权,需要token验证
        // el-upload组件没有像axios请求拦截并将token加到headers中
        // 所以需要手动从本地获取token,添加到headers中
        Authorization: "Bearer " + localStorage.getItem("adminToken")
      };
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      if (!res.code && res.data) {
        // 上传成功，服务器给我们返回了图片上传后的服务器地址
        this.$emit("input", res.data);
      }
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
