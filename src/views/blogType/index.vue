<template>
  <div class="app-container">
    <!-- 输入框,按钮 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入文章分类,并在左边选择分类等级"
        v-model="input"
        class="input-with-select"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-input>
      <el-button
        @click="addBlogTypeHandle"
        style="margin-left: 20px;"
        type="primary"
        >添加</el-button
      >
    </div>

    <!-- 文章分类表格 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="blogTypeData"
      border
      highlight-current-row
    >
      <el-table-column label="序号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="博客类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="文章数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.articleCount }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="editBlogTypeHandle(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              @click="deleteBlogTypeHandle(scope.row)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑文章分类弹出框 -->
    <el-dialog
      title="请编辑文章分类"
      :visible.sync="dialogFormVisible"
      top="8vh"
    >
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogTypeHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  addBlogType,
  getBlogTypeById,
  deleteBlogType,
  editBlogType
} from "@/api/blogType";

export default {
  data() {
    return {
      blogTypeData: [], //博客分类数据
      input: "", //分类名称
      select: "1", //分类等级
      form: {
        //需要编辑的内容表单
        name: "", //input
        order: "" //select
      },
      listLoading: false,
      dialogFormVisible: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getBlogType().then(res => {
        this.blogTypeData = res.data;
        this.listLoading = false;
      });
    },
    // 添加文章分类
    addBlogTypeHandle() {
      if (this.input) {
        addBlogType({ name: this.input, order: this.select }).then(() => {
          this.fetchData();
          this.input = "";
          this.$message.success("添加分类成功");
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 编辑文章分类
    editBlogTypeHandle({ id }) {
      // 渲染表单内容，打开编辑框
      getBlogTypeById(id).then(res => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    // 确认编辑文章分类
    confirmEditBlogTypeHandle() {
      editBlogType({
        id: this.form.id,
        data: this.form
      }).then(() => {
        this.fetchData();
        this.dialogFormVisible = false;
        this.$message.success("编辑文章分类成功");
      });
    },
    // 删除文章分类
    deleteBlogTypeHandle({ id }) {
      this.$confirm(
        "删除该分类后,该分类下的文章会变成未分类状态,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //删除成功后重新获取数据
          deleteBlogType(id).then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 400px;
  margin-bottom: 30px;
}
</style>
