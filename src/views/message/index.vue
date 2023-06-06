<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="messageData"
      element-loading-text="数据加载中"
      style="width: 100%"
      border
    >
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <!-- 序号=当前页索引+当前页码*每页数量 -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="头像" width="100" align="center">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="昵称" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column label="留言内容" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column label="留言日期" width="230" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              @click="removeMessageHandle(scope.row)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <div>
      <el-pagination
        style="margin-top: 20px;"
        background
        layout="prev, pager, next, total, ->, sizes, jumper"
        :total="totalNum"
        :page-size="limitPage"
        :page-sizes="[2, 3, 5, 10, 20]"
        :current-page.sync="pagerCurrentPage"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        @prev-click="prevClickHandle"
        @next-click="nextClickHandle"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getMessage, deleteMessage } from "@/api/message";
import { formatDate } from "@/utils/formatDate";
import { server_URL } from "@/utils/urlConfig.js";
export default {
  data() {
    return {
      messageData: [], //存储数据
      listLoading: false,

      // 分页信息
      currentPage: 1, //当前页码
      limitPage: 5, //每页显示数量
      totalNum: 0, //文章总数
      countPage: 0, //总页数
      pagerCurrentPage: 1 // 分页栏当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getMessage(this.currentPage, this.limitPage).then(({ data }) => {
        this.messageData = data.rows;
        this.listLoading = false;
        for (let item of this.messageData) {
          item.avatar = server_URL + item.avatar;
          item.createDate = formatDate(item.createDate);
        }
        // 设置分页信息
        this.totalNum = data.total;
        // 总页数=文章总数/每页数量
        this.countPage = Math.ceil(this.totalNum / this.limitPage);
        //最后一页只有一条数据,删除之后,总页码数就会减一
        //当前页码数就大于总页码数,进行处理
        if (this.currentPage > this.countPage) {
          this.currentPage = this.countPage;
          this.fetchData();
        }
      });
    },

    // 分页方法
    sizeChangeHandle(page) {
      this.limitPage = parseInt(page);
      this.currentPage = 1;
      this.pagerCurrentPage = 1; //改变每页显示数量后要显示第一页
      this.fetchData();
    },
    currentChangeHandle(page) {
      this.currentPage = parseInt(page);
      this.fetchData();
    },
    prevClickHandle() {
      this.currentPage--;
    },
    nextClickHandle() {
      this.currentPage++;
    },

    // 删除留言
    removeMessageHandle(messageInfo) {
      this.$confirm("此操作将永久删除该留言, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMessage(messageInfo.id).then(() => {
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

<style lang="scss" scoped></style>
