import userStore from '@/utils/userStore';
import axios from 'axios';
import { keccak256 } from 'js-sha3';

// 响应拦截器：处理认证失败
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 认证失败，清除本地用户信息并跳转到登录页
      userStore.clearUser();
      // 如果当前页面不是登录页，则跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export async function uploadImage(selectedImage) {
  try {
    const formData = new FormData();
    formData.append('file', selectedImage);

    const response = await axios.post('http://localhost:8082/grow_image/', formData, {
      withCredentials: true, // 携带cookies进行鉴权
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const imageUrl = 'http://localhost:8082/ShowImg/GrowImage/' + response.data.data;
    const imgname = response.data.data;
    console.log(imageUrl);
    return { imageUrl, imgname };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function predictImage(imgname) {
  try {
    console.log({ imageid: imgname, modelid: '1' });
    const response = await axios.post(
      'http://localhost:8082/PredictImage',
      { imageid: imgname, modelid: '1' },
      {
        withCredentials: true, // 携带cookies进行鉴权
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const imageUrl = 'http://localhost:8082/ShowImg/PredictGrowImage/' + imgname;
    const result = response.data;
    return { imageUrl, result };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function login(username, password2) {
  console.log(username);
  const password = keccak256(password2);

  try {
    // 修正端口为Go服务器端口（通常是8080或8082）
    const response = await axios.post(
      'http://localhost:8082/userlogin',
      {
        username,
        password,
      },
      {
        withCredentials: true, // 允许携带cookies
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log({ username: username, password: password });
    console.log(response.data);

    // 如果登录成功，存储用户信息和Token到localStorage
    if (response.data.code === '200') {
      // 存储Token
      localStorage.setItem('token', response.data.token);

      // 存储用户信息
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response.data.id,
          username: response.data.username,
          imgurl: response.data.imgurl,
        })
      );
    }

    return 200;
  } catch (error) {
    console.error('Error:', error);
    return 500;
  }
}

// 退出登录
export async function logout() {
  try {
    const response = await axios.post(
      'http://localhost:8082/userlogout',
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // 清除本地存储的用户信息
    localStorage.removeItem('user');

    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// 检查登录状态（可选实现）
export async function checkAuthStatus() {
  try {
    // 这里可以添加一个专门的接口来检查当前登录状态
    // 暂时通过请求受保护的资源来检查
    const response = await axios.get('http://localhost:8082/protected-route', {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export function getTemperatureData(
  regionName,
  value1,
  yeardata,
  monthdata,
  daydata,
  startyear,
  endyear
) {
  let location = null;
  switch (regionName) {
    case '浦东新区':
      location = '1';
      break;
  }
  console.log(value1);
  const formData = {
    location: location,
  };
  if (value1 == 'year') {
    formData.type = 'year';
    formData.start = yeardata;
    formData.xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  }
  if (value1 == 'month') {
    formData.type = 'month';
    formData.start = monthdata;
    formData.xData = [1, 5, 10, 15, 20, 25, 30];
  }
  if (value1 == 'day') {
    formData.type = 'day';
    formData.start = daydata;
    formData.xData = [
      '00:00',
      '01:00',
      '02:00',
      '03:00',
      '04:00',
      '05:00',
      '06:00',
      '07:00',
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
      '23:00',
    ];
  }
  if (value1 == 'manyyear') {
    formData.type = 'manyyear';
    formData.start = startyear;
    formData.end = endyear;
    const startYearNumber = startyear.getFullYear();
    const endYearNumber = endyear.getFullYear();
    formData.xData = Array.from(
      { length: endYearNumber - startYearNumber + 1 },
      (_, i) => i + startYearNumber
    );
  }
  return formData;
}

export async function register(username, password) {
  const hashedPassword = keccak256(password);
  const userData = {
    username: username,
    password: hashedPassword,
  };
  try {
    const response = await axios.post('http://localhost:8082/usersignup', userData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    console.log(response.data);
    if (response.status == 400) {
      return 400;
    }
    if (response.status == 200) {
      console.log(response.data);
      return 200;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function uploadUserImage(selectedImage, userId) {
  console.log(selectedImage);
  try {
    const formData = new FormData();
    formData.append('file', selectedImage);
    formData.append('userid', userId);

    const response = await axios.post('http://localhost:8082/UploadUserImage', formData, {
      withCredentials: true, // 携带cookies进行鉴权
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.code == 200) {
      alert('上传成功！');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}
