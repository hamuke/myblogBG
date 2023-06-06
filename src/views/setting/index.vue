<template>
  <div class="app-container">
    <div class="titleText" style="margin-top: 0;">网站信息</div>
    <div class="text">网站标题</div>
    <el-input class="inputText" v-model="form.siteTitle" disabled></el-input>
    <div class="text">邮箱</div>
    <el-input class="inputText" v-model="form.mail" disabled>
      <template slot="append">.com</template>
    </el-input>
    <div class="text">备案号</div>
    <el-input class="inputText" v-model="form.icp" disabled></el-input>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="12">
        <div class="titleText">网站头像</div>
        <el-image style="width: 150px;" :src="form.avatar"></el-image>
        <el-divider></el-divider>
      </el-col>
      <el-col :span="12">
        <div class="titleText">网站图标</div>
        <el-image style="width: 150px;" :src="form.favicon"></el-image>
        <el-divider></el-divider>
      </el-col>
    </el-row>

    <div class="titleText">github信息</div>
    <div class="text">github名称</div>
    <el-input class="inputText" v-model="form.githubName" disabled></el-input>
    <div class="text">github地址</div>
    <el-input class="inputText" v-model="form.github" disabled>
      <template slot="prepend">https://</template>
    </el-input>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="12">
        <div class="titleText">QQ信息</div>
        <div class="text">QQ号码</div>
        <el-input class="inputText" v-model="form.qq" disabled></el-input>
        <div class="text">QQ二维码图片预览</div>
        <el-image style="width: 150px;" :src="form.qqQrCode"></el-image>
        <el-divider></el-divider>
      </el-col>
      <el-col :span="12">
        <div class="titleText">微信信息</div>
        <div class="text">微信号码</div>
        <el-input class="inputText" v-model="form.weixin" disabled></el-input>
        <div class="text">微信二维码图片预览</div>
        <el-image style="width: 150px;" :src="form.weixinQrCode"></el-image>
        <el-divider></el-divider>
      </el-col>
    </el-row>

    <el-button
      @click="editSettingHandle"
      type="primary"
      style="margin-top: 15px"
      >进入编辑模式</el-button
    >

    <!-- 网站信息编辑页 -->
    <el-dialog
      title="编辑网站信息"
      :visible.sync="dialogFormVisible"
      :fullscreen="true"
    >
      <el-form :model="form">
        <el-form-item class="inputText" label="网站标题">
          <el-input v-model="form.siteTitle"></el-input>
        </el-form-item>
        <el-form-item class="inputText" label="邮箱">
          <el-input v-model="form.mail">
            <template slot="append">.com</template>
          </el-input>
        </el-form-item>
        <el-form-item class="inputText" label="备案号">
          <el-input v-model="form.icp"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="网站头像">
              <ImgUpload v-model="form.avatar"></ImgUpload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网站图标">
              <ImgUpload v-model="form.favicon"></ImgUpload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item class="inputText" label="Github名称">
          <el-input v-model="form.githubName"></el-input>
        </el-form-item>
        <el-form-item class="inputText" label="Github地址">
          <el-input v-model="form.github">
            <template slot="prepend">https://</template>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item class="inputText" label="qq号码">
              <el-input v-model="form.qq"></el-input>
            </el-form-item>
            <el-form-item label="qq二维码">
              <ImgUpload v-model="form.qqQrCode"></ImgUpload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="inputText" label="微信号码">
              <el-input v-model="form.weixin"></el-input>
            </el-form-item>
            <el-form-item label="微信二维码">
              <ImgUpload v-model="form.weixinQrCode"></ImgUpload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSettingHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSetting, setSetting } from "@/api/setting";
import { server_URL } from "@/utils/urlConfig.js";
import ImgUpload from "@/components/ImgUpload/index.vue";
export default {
  data() {
    return {
      form: {
        siteTitle: "",
        mail: "",
        icp: "",
        avatar: "",
        favicon: "",
        github: "",
        githubName: "",
        qq: "",
        qqQrCode: "",
        weixin: "",
        weixinQrCode: ""
      },
      dialogFormVisible: false
    };
  },
  components: {
    ImgUpload
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getSetting().then(({ data }) => {
        this.form = data;
        // 处理图片的链接
        const avatar2 = server_URL + this.form.avatar;
        const favicon2 = server_URL + this.form.favicon;
        const qqQrCode2 = server_URL + this.form.qqQrCode;
        const weixinQrCode2 = server_URL + this.form.weixinQrCode;
        if (!this.form.avatar.includes(server_URL)) {
          this.form.avatar = avatar2;
          this.form.favicon = favicon2;
          this.form.qqQrCode = qqQrCode2;
          this.form.weixinQrCode = weixinQrCode2;
        }
        // this.form.avatar = server_URL  + this.form.avatar;
        // this.form.favicon = server_URL  + this.form.favicon;
        // this.form.qqQrCode = server_URL  + this.form.qqQrCode;
        // this.form.weixinQrCode = server_URL  + this.form.weixinQrCode;
      });
    },
    editSettingHandle() {
      this.dialogFormVisible = true;
    },
    confirmSettingHandle() {
      setSetting(this.form).then(() => {
        this.fetchData();
        this.dialogFormVisible = false;
        this.$message.success("修改成功!");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.titleText {
  margin: 20px 0;
  font-weight: bold;
  font-size: large;
}
.inputText {
  width: 40%;
}
</style>
