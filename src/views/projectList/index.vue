<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="projectData"
      border
      highlight-current-row
    >
      <el-table-column label="序号" width="100" align="center">
        <template slot-scope="scope">
          <!-- 序号=当前页索引+当前页码*每页数量 -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="项目名称" width="200" align="center">
        <template slot-scope="scope">
          <a
            class="proName"
            :href="scope.row.url"
            target="_blank"
            slot="reference"
          >
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="项目描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>

      <el-table-column label="预览图" width="300" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 150px;"
            :src="scope.row.imageUrl"
            :preview-src-list="srcList"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <!-- 操作按钮组 -->
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="github"
              placement="top"
            >
              <el-button
                @click="openGitHubHandle(scope.row)"
                type="primary"
                icon="el-icon-share"
                round
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <el-button
                @click="editProjectHandle(scope.row)"
                type="primary"
                icon="el-icon-edit"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                @click="removeProjectHandle(scope.row)"
                type="danger"
                icon="el-icon-delete"
                round
              ></el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 项目编辑页 -->
    <el-dialog
      title="编辑项目信息"
      :visible.sync="dialogFormVisible"
      :fullscreen="true"
    >
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <!-- 项目描述 -->
        <!-- 接口中的description返回的是数组 -->
        <el-form-item label="项目描述1">
          <el-input v-model="form.description[0]"></el-input>
        </el-form-item>
        <el-form-item label="项目描述2">
          <el-input v-model="form.description[1]"></el-input>
        </el-form-item>
        <el-form-item label="项目描述3">
          <el-input v-model="form.description[2]"></el-input>
        </el-form-item>

        <!-- 项目链接 -->
        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <!-- github 地址 -->
        <el-form-item label="Github 地址">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <el-form-item label="预览图">
          <ImgUpload v-model="form.thumb"></ImgUpload>
        </el-form-item>

        <el-form-item label="项目等级">
          <el-select v-model="form.order" placeholder="项目等级">
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
        <el-button type="primary" @click="confirmProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjects, deleteProject, editProject } from "@/api/project";
import { server_URL } from "@/utils/urlConfig.js";
import ImgUpload from "@/components/ImgUpload/index.vue";
export default {
  data() {
    return {
      projectData: [], //存储项目数据
      srcList: [], //预览大图列表
      dialogFormVisible: false,
      listLoading: false,
      form: {
        //需要编辑的内容表单
        title: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1
      }
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
      // 获取所有项目信息
      getProjects().then(({ data }) => {
        this.projectData = data;
        this.listLoading = false;
        // 处理图片地址
        for (let item of this.projectData) {
          item.imageUrl = server_URL + item.thumb;
          this.srcList.push(item.imageUrl);
        }
      });
    },

    //打开一个新窗口,跳转到github地址
    openGitHubHandle(projectInfo) {
      window.open(projectInfo.github);
    },

    // 打开项目编辑框(回填表单数据)
    editProjectHandle(projectInfo) {
      this.dialogFormVisible = true;
      this.form = { ...projectInfo };
    },

    // 确认编辑项目内容
    confirmProjectHandle() {
      // 根据接口数据,进行类型处理
      let obj = { ...this.form };
      obj.order = parseInt(this.form.order);
      editProject(obj.id, obj).then(() => {
        this.fetchData();
        this.dialogFormVisible = false;
        this.$message.success("项目修改成功!");
      });
    },

    // 删除项目
    removeProjectHandle(projectInfo) {
      this.$confirm("此操作将永久删除该项目,是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //删除成功后重新获取数据
          deleteProject(projectInfo.id).then(() => {
            this.fetchData();
            this.$message.success("删除成功!");
          });
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.proName:hover {
  color: rgb(163, 163, 163);
}
</style>
