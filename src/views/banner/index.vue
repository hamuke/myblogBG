<template>
  <div class="app-container">
    <!-- 首页标语表格 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="tableData"
      border
      highlight-current-row
    >
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="中图预览" width="250" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 150px;"
            :src="scope.row.midImgUrl"
            :preview-src-list="srcList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="大图预览" width="250" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 150px;"
            :src="scope.row.bigImgUrl"
            :preview-src-list="srcList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="editBannerHandle(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹出框 -->
    <template>
      <el-dialog title="请编辑内容" :visible.sync="dialogFormVisible" top="8vh">
        <el-form :model="form">
          <el-form-item label="标题">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="中图预览">
                <ImgUpload v-model="form.midImg" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="大图预览">
                <ImgUpload v-model="form.bigImg" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner.js";
import { server_URL } from "@/utils/urlConfig.js";
import ImgUpload from "@/components/ImgUpload/index.vue";
export default {
  data() {
    return {
      tableData: [], //存储数据
      listLoading: false, //是否显示loading效果
      dialogFormVisible: false, //是否显示编辑框
      form: {
        //每条标语内容
        id: "",
        title: "",
        description: "",
        midImg: "",
        bigImg: ""
      },
      srcList: [] //预览大图数组
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
      this.listLoading = true;
      getBanner().then(res => {
        this.tableData = res.data;
        this.listLoading = false;
        for (var item of this.tableData) {
          // 图片地址前加上服务器地址http://localhost:7001
          item.midImgUrl = server_URL + item.midImg;
          item.bigImgUrl = server_URL + item.bigImg;
          this.srcList.push(item.midImgUrl);
        }
      });
    },
    // 打开编辑框并带上数据
    editBannerHandle(bannerInfo) {
      this.form = { ...bannerInfo };
      this.dialogFormVisible = true;
    },
    // 修改编辑框内容
    editBannerConfirm() {
      // 从表单中拿到用户修改的数据发送给服务器,经过处理拿到需要的那一行
      let arr = [...this.tableData];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == this.form.id) {
          arr[i] = this.form;
        }
      }
      // 成功修改内容后的操作
      setBanner(arr).then(res => {
        this.dialogFormVisible = false; //关闭编辑框
        this.fetchData(); //重新加载
        this.$message({
          //提示信息
          message: "修改成功!",
          type: "success"
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
