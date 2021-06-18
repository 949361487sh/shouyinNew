<template>
  <div>
    <div class="title">{{ title }}</div>
    <el-table
      :data="tableData"
      :height="height - 150"
      border
      style="width: 100%"
    >
      <el-table-column prop="commodityTitle" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="number" label="购买数量" width="220">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.number"
            :min="1"
            :max="100"
            label="描述文字"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="buyingPrice" label="商品进价">
        <template slot-scope="scope">
          <el-tag effect="dark">￥ {{ scope.row.buyingPrice }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="零售价">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark"
            >￥ {{ scope.row.retailPrice }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="allPic" label="小计">
        <template slot-scope="scope">
          <el-tag type="danger" effect="dark"
            >￥
            {{
              (scope.row.number * Number(scope.row.retailPrice)).toFixed(2)
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            class="bnt"
            @click="deleteShoping(scope.$index, tableData)"
            type="danger"
            plain
            size="small"
            >删除</el-button
          >
          <el-button
            class="bnt"
            type="warning"
            @click="modifyShoping(scope.row)"
            plain
            size="small"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="xiaoji">
      <span
        >小计：￥
        <span style="font-size: 2.5rem">{{ addReceivablePic }}</span> 元</span
      >
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="商品详情"
      :visible.sync="shopingDetailDialog"
    >
      <el-form :model="shopingDetaiForm" ref="shopingDetailForm" :rules="rules">
        <el-form-item
          label="商品名称"
          label-width="120px"
          prop="commodityTitle"
        >
          <el-input
            v-model="shopingDetaiForm.commodityTitle"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品条码" label-width="120px" prop="code">
          <el-input
            v-model="shopingDetaiForm.code"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品进价" label-width="120px" prop="buyingPrice">
          <el-input
            v-model="shopingDetaiForm.buyingPrice"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品零售价" label-width="120px" prop="retailPrice">
          <el-input
            v-model="shopingDetaiForm.retailPrice"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="供货商" label-width="120px">
          <el-input
            v-model="shopingDetaiForm.supplier"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="供货商电话" label-width="120px">
          <el-input
            v-model="shopingDetaiForm.supplierTel"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shopingDetailDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="shopingDetaiSubmit('shopingDetailForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { searchStockAdd, addCommodity } from "@/api/commodity";
export default {
  computed: {
    addReceivablePic() {
      // 所有商品应收相加
      let pic = 0;
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.discount = 0;
      this.tableData.forEach((item) => {
        pic += item.number * item.retailPrice;
      });
      return Number(pic).toFixed(2);
    },
  },
  data() {
    return {
      title: "速度", //恒元便利店
      tableData: [],
      height: 200,
      shopingDetailDialog: false,
      shopingDetaiForm: {
        commodityTitle: "",
        code: "",
        buyingPrice: "",
        retailPrice: "",
        supplier: "",
        supplierTel: "",
      },
      rules: {
        commodityTitle: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        code: [{ required: true, message: "请输入商品条码", trigger: "blur" }],
        buyingPrice: [
          { required: true, message: "请输入商品进价", trigger: "blur" },
        ],
        retailPrice: [
          { required: true, message: "请输入商品零售价", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initCode();
    this.height = document.documentElement.clientHeight;
  },
  methods: {
    modifyShoping(row) {
      this.shopingDetaiForm = row;
      this.shopingDetailDialog = true;
    },
    shopingDetaiSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addCommodity(this.shopingDetaiForm).then((res) => {
            if (res.code == 0) {
              this.msgSuccess("保存成功");
              this.shopingDetailDialog = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCodeShoping(type) {
      searchStockAdd({ code: type }).then((res) => {
        if (res.code == 0) {
          if (res.data.length == 0) {
            this.msgInfo("没有该商品信息，请新增商品后在查询!");
            setTimeout(() => {
              this.shopingDetailDialog = true;
            }, 200);
            // 如果没有查询出来商品，则说明可能没有该商品，则要新增商品
            return;
          }
          res.data.map((item) => {
            item.number = 1;
          });
          this.addShopingList(res.data[0]);
        }
      });
    },
    async addShopingList(item) {
      let is = 0; // 判断是否已经添加 0没有 1已经有
      await this.tableData.map((map) => {
        if (item.id == map.id) {
          is = 1;
          map.number++;
        }
      });
      if (is == 0) {
        this.tableData.push(item);
      }
    },
    deleteShoping(index, rows) {
      rows.splice(index, 1);
    },
    initCode() {
      let code = "";
      let lastTime, nextTime;
      let lastCode, nextCode;
      let that = this;
      window.document.onkeypress = function (e) {
        if (e.key == " ") {
          if (that.tableData.length == 0) {
            that.msgInfo("请选择商品");
            return;
          }
          const pic = "您本次消费 " + that.addReceivablePic + "元";
          let url =
            "http://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=0&tex=" +
            pic;
          let n = new Audio(url);
          n.src = url;
          n.play();
          that.tableData = [];
        }
        if (window.event) {
          // IE
          nextCode = e.keyCode;
        } else if (e.which) {
          // Netscape/Firefox/Opera
          nextCode = e.which;
        }
        if (e.which === 13) {
          if (code.length < 3) return; // 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有
          if (that.shopingDetailDialog) {
            that.shopingDetaiForm.code = code;
          } else {
            that.getCodeShoping(code);
          }
          // that.distinguishCode(code) // 获取到扫码枪输入的内容，做别的操作
          code = "";
          lastCode = "";
          lastTime = "";
          return;
        }
        nextTime = new Date().getTime();
        if (!lastTime && !lastCode) {
          console.log("扫码开始。。。");
          code += e.key;
        }

        if (lastCode && lastTime && nextTime - lastTime > 500) {
          // 当扫码前有keypress事件时,防止首字缺失
          console.log("防止首字缺失。。。");
          code = e.key;
        } else if (lastCode && lastTime) {
          console.log("扫码中。。。");
          code += e.key;
        }
        lastCode = nextCode;
        lastTime = nextTime;
      };
    },
  },
};
</script>
<style>
.title {
  padding: 10px 0px;
  background-color: rgb(245, 89, 89); /* 不支持线性的时候显示 */
  background-image: linear-gradient(
    to right,
    rgb(241, 74, 74),
    rgb(245, 31, 191)
  );
  color: aliceblue;
  font-size: 1.3rem;
}
.el-table th > .cell {
  font-size: 1.5rem;
  font-weight: 100;
  text-align: center;
}

.el-table td .cell {
  font-size: 1.5rem;
  text-align: center;
}
.el-table td .el-tag {
  font-size: 1.5rem;
}
.el-table td .bnt {
  font-size: 1.5rem;
}
.xiaoji {
  font-size: 1.5rem;
  padding: 20px;
  color: red;
}
</style>