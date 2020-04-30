package com.brightease.bju.utils;

import com.brightease.bju.api.ResultCode;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * 结果返回方法
 * @author xuyt
 *
 */
public class ResultUtil {
	/**
	 * 成功请求
	 * @param obj 不为null时返回结果
	 * @param msg 为null时返回“请求成功” 不为null时 返回msg内容  
	 * @return
	 */
	public static Map<String,Object> Success(Object obj,String msg){
		Map<String,Object> map = new HashMap<>();
		map.put("status", ResultCode.SUCCESS.getCode());
		if(obj != null){
			map.put("result", obj);
		}
		if(msg == null){
			map.put("msg", ResultCode.SUCCESS.getMessage());
		}else{
			map.put("msg", msg);
		}
		return map;
	}

	
	/**
	 * 异常时返回
	 * @param obj 不为null时返回结果
	 * @param r 配置
	 * @return
	 */
	public static Map<String,Object> error(Object obj,ResultCode r){
		Map<String,Object> map = new HashMap<>();
		map.put("status", r.getCode());
		if(obj != null){
			map.put("result", obj);
		}
		map.put("msg", r.getMessage());
		return map;
	}
	
	public static Map<String,Object> errorMsg(Object obj,ResultCode r,String msg){
		Map<String,Object> map = new HashMap<>();
		map.put("status", r.getCode());
		if(obj != null){
			map.put("result", obj);
		}
		map.put("msg", r.getMessage() + msg);
		return map;
	}
}
