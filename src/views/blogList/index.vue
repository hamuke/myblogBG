<template>
  <div class="app-container">
    <!-- 文章列表 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      :data="blogData"
      border
      highlight-current-row
    >
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <!-- 序号=当前页索引+当前页码*每页数量 -->
          {{ scope.$index + (currentPage - 1) * limitPage + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="文章名称" width="200" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="文章预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px;"
              :src="scope.row.thumb"
              :preview-src-list="srcList"
              fit="contain"
            >
            </el-image>
            <a
              href="#"
              target="_blank"
              @click.prevent="gotoTitleHandle(scope.row)"
              slot="reference"
            >
              {{ scope.row.title }}
            </a>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="文章描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="浏览量" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="评论量" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="所属分类" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.category.name }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="创建日期" width="230" align="center">
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button
              @click="editBlogHandle(scope.row)"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button
              @click="removeBlogHandle(scope.row)"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="block">
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
import { getBlog, deleteBlog } from "@/api/blog";
import { formatDate } from "@/utils/formatDate";
import { server_URL, browser_URL } from "@/utils/urlConfig.js";
export default {
  data() {
    return {
      blogData: [], //存储数据
      srcList: [], //预览图数据
      listLoading: false,

      // 分页组件数据
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
      getBlog(this.currentPage, this.limitPage).then(({ data }) => {
        this.blogData = data.rows;
        this.listLoading = false;
        for (let item of this.blogData) {
          // 时间戳转需求时间格式
          item.createDate = formatDate(item.createDate);
          // 设置图片地址
          item.thumb = server_URL + item.thumb;
          this.srcList.push(item.thumb);
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

    // 跳转到对应的文章页
    gotoTitleHandle(blogInfo) {
      window.open(`${browser_URL}/article/${blogInfo.id}`);
    },

    // 编辑指定id文章
    editBlogHandle(blogInfo) {
      // 点击跳转到编辑页
      this.$router.push(`/editBlog/${blogInfo.id}`);
    },

    // 删除指定id文章
    removeBlogHandle(blogInfo) {
      this.$confirm(
        "删除该博客会将该博客下的所有评论一并删除,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //删除成功后重新获取数据
          deleteBlog(blogInfo.id).then(() => {
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
