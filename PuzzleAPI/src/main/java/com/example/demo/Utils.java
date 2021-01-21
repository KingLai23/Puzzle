package com.example.demo;

import javax.servlet.http.HttpServletRequest;
import okhttp3.RequestBody;
import java.util.HashMap;
import java.util.Map;

public class Utils {
	public static RequestBody emptyRequestBody = RequestBody.create(null, "");

	private static String getUrl(HttpServletRequest req) {
		String requestUrl = req.getRequestURL().toString();
		String queryString = req.getQueryString();

		if (queryString != null) {
			requestUrl += "?" + queryString;
		}
		return requestUrl;
	}

	public static Map<String, Object> postResponse(HttpServletRequest req, String status, Object data) {
		
		Map<String, Object> response = new HashMap<String, Object>();
		
		response.put("path", String.format("POST %s", getUrl(req)));
		response.put("status", status);
		response.put("data", data);
		
		return response;
	}
}
