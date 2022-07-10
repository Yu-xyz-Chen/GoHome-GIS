package bll.service;

import bll.util.DetectGroup;
import bll.util.FaceSearchGroup;
import bll.util.FileUtil;
import bll.util.Result;
import com.alibaba.fastjson.JSON;
import com.megvii.cloud.http.CommonOperate;
import com.megvii.cloud.http.Response;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/16
 *
 * face++业务逻辑
 */
public class FaceppService {

    private static final String API_KEY = "kxtAupklJVkY_NV6h02Q0yqa9GI4WO6q";
    private static final String API_SECRET = "Xo8IVcSLm2GpqtJaHRdX0LFYH9mVDdJY";

    /**
     * 获得人脸face_token
     *
     * @param fileByte 文件二进制数组
     * @return null 未检测到人脸
     *          multi-faces 多个人脸
     *          face_token 一个人脸
     *          error_message 网络请求错误信息
     * */
    public String getFaceToken(byte[] fileByte) throws Exception{
        CommonOperate operate = new CommonOperate(API_KEY, API_SECRET, false);
        Response response = null;
        // 返回Json对应DetectGroup实体
        response = operate.detectByte(fileByte,0,null);
        String jsonStr = new String(response.getContent());
        System.out.println("人脸检测:" + jsonStr);
        DetectGroup group = JSON.parseObject(jsonStr,DetectGroup.class);
        if (group.getError_message()==null) {   // 未返回错误信息
            if (group.getFaces().size()>0) {
                if (group.getFaces().size()==1) {
                    return group.getFaces().get(0).getFace_token();
                }
                else {
                    return "multi-faces";
                }
            } else {
                return null;
            }
        } else {
            return group.getError_message();
        }
    }

    /**
     * 通过face_token搜索人脸
     *
     * @param faceToken 需要搜索的face_token
     * @param n 返回的结果数，范围为[1,5]默认为1
     * @return
     * */
    public List<Result> searchFaceByFaceToken(String faceToken, int n) throws Exception{
        CommonOperate operate = new CommonOperate(API_KEY, API_SECRET,false);
        Response response = null;
        response = operate.searchByOuterId(faceToken,null,null,"MissingPeoplePhoto",n);
        String jsonStr = new String(response.getContent());
        System.out.println("人脸搜索:" + jsonStr);
        FaceSearchGroup group = JSON.parseObject(jsonStr, FaceSearchGroup.class);
        for (int i=0;i<group.getResults().size();i++) {
            System.out.println(group.getResults().get(i).getUser_id());
        }
        return group.getResults();
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) throws Exception {
        FaceppService faceppService = new FaceppService();
        File file = new File("E:\\实习\\GIS工程\\项目参考资料\\GoHome-master\\GoHome-master\\web\\libs\\image\\all_missing_people_photo\\611512.jpg");
        try {
            InputStream inputStream = new FileInputStream(file);
            byte[] bytes = FileUtil.getBytesFromInputStream(inputStream);
            System.out.println(faceppService.getFaceToken(bytes));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
        try {
            List<Result> results = faceppService.searchFaceByFaceToken("5125956843f6ca77ada60a98a85113e5",5);
            for (Result result:results) {
                System.out.println(result.getUser_id());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
