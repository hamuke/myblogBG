<template>
  <div>
    <!-- 文章标题 -->
    <div class="text">文章标题</div>
    <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    <!-- 文章编辑 -->
    <div class="text">文章编辑</div>
    <Editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    ></Editor>
    <!-- 文章描述 -->
    <div class="text">文章描述</div>
    <el-input
      type="textarea"
      :rows="6"
      v-model="form.description"
      placeholder="请输入文章描述"
    ></el-input>
    <!-- 文章封面 -->
    <div class="text">文章封面</div>
    <ImgUpload v-model="form.thumb"></ImgUpload>
    <!-- 文章分类 -->
    <div class="text">文章分类</div>
    <el-select
      @change="changeHandle"
      v-model="form.select"
      placeholder="请选择文章分类"
    >
      <el-option
        v-for="item in blogType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <!-- 发布文章、编辑文章 -->
    <div>
      <el-button
        @click="addOrEditBlogHandle"
        style="margin-top: 15px"
        type="primary"
        >{{ buttonContent }}</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import "@toast-ui/editor/dist/i18n/zh-cn";
import ImgUpload from "@/components/ImgUpload/index.vue";
import { getBlogType } from "@/api/blogType.js";
import { addBlog, editBlog, getBlogById } from "@/api/blog.js";
export default {
  props: ["mode"],//根据mode的值来判断是发布文章还是编辑文章
  data() {
    return {
      form: {
        //需要编辑的内容表单
        title: "", //文章标题
        editorText: "", //文章编辑
        description: "", //文章描述
        thumb: "", //文章封面
        select: "" //选择文章分类
      },
      editorOptions: {
        language: "zh-CN",
      },
      blogType: [], //文章分类
      imageUrl: "", // 图片在服务器上的地址
      buttonContent: "发布文章"
    };
  },
  created() {
    // 获取文章分类的数据用于添加文章时选择对应分类
    getBlogType().then(res => {
      this.blogType = res.data;
    });
    if (this.mode === "edit") {
      // 根据传递的id值获取文章，回填表单内容
      this.id = this.$route.params.id;
      getBlogById(this.id).then(({ data }) => {
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
      });
      this.buttonContent = "编辑文章";
    }
  },
  components: {
    Editor,
    ImgUpload
  },
  methods: {
    addOrEditBlogHandle() {
      // 获取编辑文章的表单内容
      let html = this.$refs.toastuiEditor.invoke("getHTML");
      let markdown = this.$refs.toastuiEditor.invoke("markdown");

      // 组装要传递给服务器的对象
      let obj = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        htmlContent: html,
        markdownContent: markdown,
        thumb: this.form.thumb,
        // 根据markdown的内容生成toc目录
        toc: []
      };

      //将对象发送到服务器
      if (obj.title && obj.description && obj.htmlContent && obj.categoryId) {
        if (this.mode === "add") {
          addBlog(obj).then(() => {
            this.$router.push("/blogList"); //跳转到文章列表页
            this.$message.success("文章发布成功");
          });
        } else {
          editBlog({ id: this.form.id, data: obj }).then(() => {
            this.$router.push("/blogList"); //跳转到文章列表页
            this.$message.success("文章修改成功");
          });
        }
      } else {
        this.$message.error("内容不能为空，请检查填写内容");
      }
    },
    changeHandle() {
      // el-select 和 el-option不同步问题
      // 手动强制刷新即可
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.text {
  margin: 15px 0;
  font-weight: 120;
}
</style>
