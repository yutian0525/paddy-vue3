import axios from 'axios';
import ElMessage from "@jiaminghi/data-view/deploy/plugin/print";

export async function uploadImage(selectedImage) {
    try {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await axios.post('http://127.0.0.1:5000/grow_image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        const imageUrl = "http://127.0.0.1:5000/ShowImg/GrowImage/" + response.data.data;
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
        console.log({ imageid: imgname, modelid: "1" });
        const response = await axios.post('http://localhost:5000/PredictImage', { imageid: imgname, modelid: "1" });

        const imageUrl = "http://127.0.0.1:5000/ShowImg/PredictGrowImage/" + imgname;
        const result = response.data;
        return { imageUrl, result };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export async function login(username, password) {
    console.log(username);
    console.log(password);

    try {
        const response = await axios.post('http://localhost:5000/userlogin', { username, password });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
export function getTemperatureData(regionName, value1, yeardata, monthdata, daydata, startyear, endyear) {
    let location = null;
    switch (regionName) {
        case "浦东新区":
            location = "1";
            break;
    }
    console.log(value1);
    const formData = {
        location: location,
    };
    if (value1 == "year") {
        formData.type = "year";
        formData.start = yeardata;
        formData.xData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    }
    if (value1 == "month") {
        formData.type = "month";
        formData.start = monthdata;
        formData.xData = [1, 5, 10, 15, 20, 25, 30];
    }
    if (value1 == "day") {
        formData.type = "day";
        formData.start = daydata;
        formData.xData = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
    }
    if (value1 == "manyyear") {
        formData.type = "manyyear";
        formData.start = startyear;
        formData.end = endyear;
        const startYearNumber = startyear.getFullYear();
        const endYearNumber = endyear.getFullYear();
        formData.xData = Array.from({ length: endYearNumber - startYearNumber + 1 }, (_, i) => i + startYearNumber);
    }
    return formData;
}
export async function register(username, password, confirmpassword, router) {
    const userData = {
        username: username,
        password: password
    };

    if (password !== confirmpassword) {
        ElMessage.error('两次密码输入不一致，请重新输入!');
    } else {
        try {
            const response = await axios.post('http://localhost:5000/usersignup', userData, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
            console.log(response.data);
            if (response.status == 400) {
                ElMessage.error('用户名已存在，请重新输入!');
            }
            if (response.status == 200) {
                console.log(response.data);
                ElMessage({
                    message: '注册成功!',
                    type: 'success',
                });
                router.push('/Loginpage');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
export async function uploadUserImage(selectedImage, userId) {
    console.log(selectedImage);
    try {
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('userid', userId);

        const response = await axios.post('http://127.0.0.1:5000/UploadUserImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.code == 200) {
            alert("上传成功！");
        }
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}