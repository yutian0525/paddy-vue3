<template>
  <div class="predict-page">
    <div class="content-container">
      <div class="upload-section">
        <h2>疾病检测</h2>
        <el-upload
          class="upload-box"
          drag
          action="http://127.0.0.1:8082/DiseaseImage"
          :headers="uploadHeaders"
          :on-success="handleDiseaseUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeImageUpload"
          :show-file-list="false"
          accept="image/*"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传图片文件</div>
        </el-upload>
        <div v-if="diseaseUploadResult" class="upload-result">
          {{ diseaseUploadResult }}
        </div>

        <!-- Added Prediction UI -->
        <div v-if="diseaseImageId" class="prediction-section">
          <h3>开始预测</h3>
          <el-button type="primary" @click="predictDisease" :disabled="!diseaseImageId">
            开始预测
          </el-button>
          <div v-if="diseasePredictionResult" class="prediction-result">
            {{ diseasePredictionResult }}
          </div>
        </div>
        <!-- End Added Prediction UI -->

      </div>

      <div class="upload-section">
        <h2>成长期预测</h2>
        <el-upload
          class="upload-box"
          drag
          action="http://127.0.0.1:8082/grow_image/"
          :headers="uploadHeaders"
          :on-success="handleGrowUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeImageUpload"
          :show-file-list="false"
          accept="image/*"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传图片文件</div>
        </el-upload>
         <div v-if="growUploadResult" class="upload-result">
           {{ growUploadResult }}
         </div>
        <!-- Added Prediction UI for Grow Image -->
        <div v-if="growImageId" class="prediction-section">
          <h3>开始预测</h3>
          <el-button type="primary" @click="predictGrow" :disabled="!growImageId">
            开始预测
          </el-button>
          <div v-if="growPredictionResult" class="prediction-result">
            预测结果: {{ growPredictionResult }}
          </div>
        </div>
        <!-- End Added Prediction UI for Grow Image -->
      </div>
     </div>
   </div>
 </template>

 <script>
 import { post } from '@/utils/request'; // 引入 post 方法
import { Message } from 'element-ui'; // 引入 Message 组件

 export default {
   components: {
   },
   data() {
     return {
       diseaseUploadResult: '',
       growUploadResult: '',
       diseaseImageId: '', // 用于存储上传成功的疾病图片文件名
       diseasePredictionResult: '', // 用于存储预测结果
       growImageId: '', // 用于存储上传成功的成长期图片文件名
       growPredictionResult: '', // 用于存储预测结果
       uploadHeaders: {} // 新增：用于存放上传请求头
     };
   },
   created() {
    // 在组件创建时设置请求头
    this.setUploadHeaders();
   },
   methods: {
    setUploadHeaders() {
      const token = localStorage.getItem('token');
      if (token) {
        this.uploadHeaders = {
          'Authorization': `Bearer ${token}`
        };
      }
    },
     handleDiseaseUploadSuccess(response, file, fileList) {
       console.log('疾病检测图片上传成功:', response);
       if (response && response.data) {
         this.diseaseImageId = response.data; // 存储返回的文件名作为 imageid
         this.diseaseUploadResult = `上传成功，图片ID: ${this.diseaseImageId}`;
         Message.success('疾病检测图片上传成功！');
         this.predictDisease(); // 上传成功后自动触发预测
       } else {
         this.diseaseUploadResult = '上传成功，但未获取到图片ID。';
         Message.warning('图片上传成功，但后端未返回图片ID。');
       }
     },
     handleGrowUploadSuccess(response, file, fileList) {
       console.log('成长期预测图片上传成功:', response);
       if (response && response.data) {
         this.growImageId = response.data; // 存储返回的文件名作为 imageid
         this.growUploadResult = `上传成功，图片ID: ${this.growImageId}`;
         Message.success('成长期预测图片上传成功！');
         this.predictGrow(); // 上传成功后自动触发预测
       } else {
         this.growUploadResult = '上传成功，但未获取到图片ID。';
         Message.warning('图片上传成功，但后端未返回图片ID。');
       }
     },
     async predictGrow() {
       this.growPredictionResult = '预测中...';
       try {
         // 使用默认模型ID "1"
         const response = await post('/PredictImage', { imageid: this.growImageId, modelid: "1" });
         console.log('成长期预测 - 原始响应:', response); // Log the raw response
         console.log('成长期预测 - 原始响应类型:', typeof response); // Log the type of raw response
         console.log('成长期预测 - 响应数据:', response ? response.data : 'response is null/undefined'); // Log response.data, handle null/undefined response
         console.log('成长期预测 - 响应数据类型:', response ? typeof response.data : 'response is null/undefined'); // Log type of response.data

         let predictionData = null;
         let rawDataBase64 = null;

         if (typeof response === 'string') {
             rawDataBase64 = response;
             console.log('成长期预测 - 尝试解码原始响应 (string)');
         } else if (response && typeof response.data === 'string') {
             rawDataBase64 = response.data;
             console.log('成长期预测 - 尝试解码 response.data (string)');
         } else if (response && typeof response.data === 'object') {
             predictionData = response.data; // response.data is already an object
             console.log('成长期预测 - response.data 已经是对象');
         } else {
            this.growPredictionResult = '成长期预测成功，但返回数据格式不正确。';
            Message.warning('成长期预测成功，但后端返回数据格式不正确。');
            console.error('成长期预测 - 返回数据格式不正确:', response);
            return;
         }

         if (rawDataBase64) { // If rawDataBase64 (string) was found, attempt decoding and parsing
             try {
               // Decode base64 string to a byte array
               const byteCharacters = atob(rawDataBase64);
               const byteNumbers = new Array(byteCharacters.length);
               for (let i = 0; i < byteCharacters.length; i++) {
                 byteNumbers[i] = byteCharacters.charCodeAt(i);
               }
               const byteArray = new Uint8Array(byteNumbers);

               // Decode byte array to UTF-8 string
               const decodedString = new TextDecoder('utf-8').decode(byteArray);

               // Parse JSON string
               predictionData = JSON.parse(decodedString);
               console.log('成长期预测 - 解码并解析后的数据:', predictionData);
             } catch (e) {
               console.error('成长期预测 - 解码或解析结果失败:', e);
               this.growPredictionResult = '成长期预测结果解码或解析失败。';
               Message.error('成长期预测结果处理失败。');
               return;
             }
         }

         // Check and display the result field
         if (predictionData && predictionData.result !== undefined) {
            this.growPredictionResult = predictionData.result;
            Message.success('成长期预测成功！');
            console.log('成长期预测 - 成功显示结果:', this.growPredictionResult);
         } else if (predictionData && predictionData.data && predictionData.data.result !== undefined) {
            this.growPredictionResult = predictionData.data.result;
            Message.success('成长期预测成功！');
            console.log('成长期预测 - 成功显示结果:', this.growPredictionResult);
         } else {
            this.growPredictionResult = '成长期预测成功，但未获取到有效的预测结果数据。';
            Message.warning('成长期预测成功，但后端未返回有效的预测结果数据。');
            console.warn('成长期预测 - 未找到有效的预测结果数据:', predictionData);
         }

       } catch (error) {
         console.error('成长期预测请求失败:', error);
         this.growPredictionResult = '预测失败。';
         Message.error('成长期预测失败，请重试！');
       }
     },
     handleUploadError(err, file, fileList) {
       console.error('图片上传失败:', err);
      Message.error('图片上传失败，请重试！');
      // 处理上传失败的情况
    },
    beforeImageUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJpgOrPng) {
        Message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        Message.error('上传图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    async predictDisease() {
      this.diseasePredictionResult = '预测中...';
      try {
        // 使用默认模型ID "2"
        const response = await post('/PredictImage', {
          imageid: this.diseaseImageId,
          modelid: "2"
        });
        console.log('疾病检测完整响应:', response); // 添加日志
        console.log('疾病检测响应数据类型:', typeof response); // 修改日志，检查 response 本身的类型
        console.log('疾病检测响应数据:', response); // 修改日志，检查 response 本身的数据

        let predictionData = null;
        if (typeof response === 'object' && response !== null && response.names) {
          // response 本身就是我们需要的对象
          predictionData = {
            data: response
          };
          console.log('疾病检测响应本身就是所需对象:', response);
        } else if (typeof response === 'string') { // 尝试将 response 本身作为 base64 字符串处理
          try {
            // 解码 base64 字符串
            const decodedString = atob(response);
            // 解析 JSON 字符串
            predictionData = JSON.parse(decodedString);
            console.log('疾病检测解析后的数据:', predictionData); // 添加日志
          } catch (e) {
            console.error('解码或解析疾病检测结果失败:', e);
            this.diseasePredictionResult = '疾病检测结果解码或解析失败。';
            Message.error('疾病检测结果处理失败。');
            return; // 解码或解析失败，停止后续处理
          }
        } else if (response && typeof response.data === 'string') { // 如果 response 本身不是字符串，检查 response.data
           try {
             // 解码 base64 字符串
             const decodedString = atob(response.data);
             // 解析 JSON 字符串
             predictionData = JSON.parse(decodedString);
             console.log('疾病检测解析后的数据 (response.data):', predictionData); // 添加日志
           } catch (e) {
             console.error('解码或解析疾病检测结果失败:', e);
             this.diseasePredictionResult = '疾病检测结果解码或解析失败。';
             Message.error('疾病检测结果处理失败。');
             return; // 解码或解析失败，停止后续处理
           }
        } else if (response && typeof response.data === 'object') {
           // 如果 response.data 本身就是解析好的 JSON 对象
           predictionData = response.data;
           console.log('疾病检测响应数据已经是对象:', predictionData); // 添加日志
        } else {
           this.diseasePredictionResult = '疾病检测成功，但返回数据格式不正确。';
           Message.warning('疾病检测成功，但后端返回数据格式不正确。');
           return; // 数据格式不正确，停止后续处理
        }

        console.log('疾病检测 - 最终 predictionData:', predictionData);
        console.log('疾病检测 - 最终 predictionData.data:', predictionData ? predictionData.data : 'predictionData is null/undefined');

        // 详细输出 predictionData 结构，辅助调试
        console.log('预测数据结构检查 - 完整对象:', predictionData);
        console.log('预测数据类型:', typeof predictionData);
        console.log('预测数据 data 字段:', predictionData ? predictionData.data : 'predictionData 是 null/undefined');
        console.log('预测数据 names 字段:', predictionData ? predictionData.names : 'predictionData 是 null/undefined');
        console.log('预测数据 data.names 字段:', predictionData && predictionData.data ? predictionData.data.names : 'predictionData.data 不存在');

        // 检查并显示预测结果 - 兼容多种数据结构
        if ((predictionData && predictionData.names) ||
            (predictionData && predictionData.data && predictionData.data.names)) {
          let resultMessage = '预测结果：\n';
          const diseaseNamesMap = {
            "blasst": "稻瘟病",
            "blight": "枯萎病",
            "brown-spot": "褐斑病",
            "dead-heart": "枯心病",
            "downy": "霜霉病",
            "False": "未检测到",
            "norm": "正常",
            "sheath-blight": "纹枯病",
            "streak": "条纹病",
            "tungro": "稻曲病"
          };

          // 处理病害名称并过滤掉“未检测到”和“正常”
          if (predictionData.names) {
            const translatedNames = Object.values(predictionData.names)
              .map(name => diseaseNamesMap[name] || name)
              .filter(name => name !== "未检测到" && name !== "正常");

            // 如果存在检测到的病害，则添加到结果消息中
            if (translatedNames.length > 0) {
              resultMessage += `检测到的病害：\n${translatedNames.join('\n')}`; // 每种病害单独一行
            }
          }

          // 处理 message 字段（尝试解码乱码）
          if (predictionData.message) {
            try {
              // 将乱码字符串视为 Latin-1 编码的字节序列
              const latin1Bytes = new Uint8Array(predictionData.message.length);
              for (let i = 0; i < predictionData.message.length; i++) {
                latin1Bytes[i] = predictionData.message.charCodeAt(i);
              }
              // 使用 TextDecoder 将字节序列解码为 UTF-8 字符串
              const decodedMessage = new TextDecoder('utf-8').decode(latin1Bytes);
              // 如果已经有病害列表，则换行再添加消息
              if (resultMessage !== '预测结果：\n') {
                resultMessage += '\n';
              }
              resultMessage += `消息：${decodedMessage}`;
            } catch (e) {
              console.error('解码 message 失败:', e);
              if (resultMessage !== '预测结果：\n') {
                resultMessage += '\n';
              }
              resultMessage += `原始消息（解码失败）：${predictionData.message}`;
            }
          }

          // 如果 resultMessage 仍然是初始值，说明没有获取到有效信息（病害或消息）
          if (resultMessage === '预测结果：\n') {
             this.diseasePredictionResult = '疾病检测成功，但未获取到有效的预测结果数据。';
             Message.warning('疾病检测成功，但后端返回数据格式不正确或缺少预测结果。');
          } else {
            this.diseasePredictionResult = resultMessage;
            Message.success('疾病检测成功！');
          }

        } else {
           this.diseasePredictionResult = '疾病检测成功，但未获取到有效的预测结果数据。';
           Message.warning('疾病检测成功，但后端未返回有效的预测结果数据。');
        }

      } catch (error) {
        console.error('疾病检测请求失败:', error);
        this.diseasePredictionResult = '预测失败。';
        Message.error('疾病检测失败，请重试！');
      }
    }
  }
};
</script>

<style scoped>
.predict-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Add this for vertical centering */
  padding: 40px 20px; /* Adjust padding */
  background-color: #1e1e1e; /* Slightly darker background */
  min-height: calc(100vh - 60px); /* Adjust based on header height if any */
}

.content-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px; /* Slightly reduced gap */
  /* Removed margin-top to allow vertical centering */
  padding: 0; /* Remove padding here, add to sections */
  width: 100%; /* Use full width */
  max-width: 1200px; /* Increased max width */
}

.upload-section {
  flex: 1;
  min-width: 320px; /* Adjusted min width */
  max-width: 500px; /* Added max width for sections */
  padding: 30px; /* Increased padding */
  border: 1px solid #333; /* Softer border */
  border-radius: 10px; /* More rounded corners */
  background-color: #252526; /* Slightly lighter dark background */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4); /* More pronounced shadow */
  text-align: center;
  color: #cccccc; /* Softer text color */
  transition: transform 0.3s ease-in-out; /* Add transition */
}

.upload-section:hover {
  transform: translateY(-5px); /* Lift effect on hover */
}

.upload-section h2 {
  margin-bottom: 25px; /* Adjusted margin */
  color: #ffffff;
  font-size: 22px; /* Slightly larger font */
  font-weight: 600; /* Bolder heading */
}

.upload-box {
  margin-bottom: 25px; /* Adjusted margin */
}

.upload-result {
  margin-top: 15px; /* Adjusted margin */
  padding: 10px;
  background-color: #3a3a3a; /* Dark background for result */
  border-radius: 5px;
  color: #67c23a;
  font-weight: bold;
  word-break: break-word; /* Ensure long words break */
  text-align: left; /* Align text left */
}

/* Prediction Section Styles */
.prediction-section {
  margin-top: 30px; /* Increased margin */
  padding-top: 30px; /* Increased padding */
  border-top: 1px solid #333; /* Softer border */
  text-align: center;
}

.prediction-section h3 {
  margin-bottom: 20px; /* Adjusted margin */
  color: #ffffff;
  font-size: 20px; /* Slightly larger font */
  font-weight: 600; /* Bolder heading */
}

.model-input {
  width: 90%; /* Increased width */
  max-width: 350px; /* Adjusted max width */
  margin-bottom: 20px; /* Adjusted margin */
}

.prediction-result {
  margin-top: 20px; /* Adjusted margin */
  padding: 15px; /* Increased padding */
  background-color: #3a3a3a; /* Dark background for result */
  border-radius: 5px;
  color: #409eff;
  font-weight: bold;
  word-break: break-word; /* Ensure long words break */
  text-align: left; /* Align text left */
  white-space: pre-wrap; /* Preserve line breaks from resultMessage */
}

/* Style for the drag area */
.el-upload-dragger {
  background-color: #333; /* Softer dark drag area background */
  border: 2px dashed #555 !important; /* Thicker, softer dashed border */
  border-radius: 8px; /* More rounded corners */
  box-sizing: border-box;
  width: 100%;
  height: 200px; /* Increased height */
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease-in-out, background-color 0.3s ease-in-out; /* Add transition */
}

.el-upload-dragger:hover {
  border-color: #66b1ff !important; /* Highlight border on hover */
  background-color: #444; /* Slightly lighter background on hover */
}


.el-upload-dragger .el-icon-upload {
  font-size: 70px; /* Slightly larger icon */
  color: #999; /* Softer icon color */
  margin: 45px 0 18px; /* Adjusted margin */
  line-height: 50px;
}

.el-upload-dragger .el-upload__text {
  color: #ccc; /* Softer text color */
  font-size: 15px; /* Slightly larger font */
  text-align: center;
}

.el-upload-dragger .el-upload__text em {
  color: #409eff; /* Primary color for link */
  font-style: normal;
}

.el-upload__tip {
  font-size: 13px; /* Slightly larger tip font */
  color: #999; /* Softer tip color */
  margin-top: 10px; /* Adjusted margin */
}

/* Element UI Button Customization (Optional, depends on global styles) */
/* If needed, you can add styles here to customize el-button */
/* Example: */
/*
.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}
.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
*/

</style>
