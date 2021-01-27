package com.example.demo;

import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.InputStream;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.Session;

@CrossOrigin
@RestController
public class Controller {

	private static final String HOST = "";
	private static final String USER = "";
	private static final String PASSWORD = "";
	private static final int PORT = 0;
	
	private static final String PUZZLE_USER = "admin";
	private static final String PUZZLE_PASSWORD = "puzzle1324";

	@RequestMapping(value = "/startMCServer", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> startMinecraftServer(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/start.sh", request);
	}

	@RequestMapping(value = "/stopMCServer", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> stopMinecraftServer(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/stop.sh", request);
	}

	@RequestMapping(value = "/restartMCServer", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> restartMinecraftServer(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		Map<String, Object> response = executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/stop.sh", request);

		if (!response.get("status").equals("GOOD")) {
			return Utils.postResponse(request, "Failed to Restart", null);
		}

		try {
			Thread.sleep(5000);
		} catch (Exception ee) {
			return Utils.postResponse(request, "Failed to Restart", null);
		}

		response = executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/start.sh", request);

		if (!response.get("status").equals("GOOD")) {
			return Utils.postResponse(request, "Failed to Restart", null);
		}

		return Utils.postResponse(request, "GOOD", null);
	}

	@RequestMapping(value = "/backupMCServer", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> backupMinecraftServer(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/server_backup.sh", request);
	}

	@RequestMapping(value = "/mcServerStatus", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> mcServerStatus(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("echo " + PASSWORD + " | sudo -S screen -list | grep -w -q 'minecraft'", request);
	}

	@RequestMapping(value = "/getActivePlayers", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getActivePlayers(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/refresh_active_players.sh", request);
	}

	@RequestMapping(value = "/getWorldSaves", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getWorldSaves(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		return executeCommand("ls minecraft/Minecraft | head $(expr 2 - $(ls minecraft/Minecraft | wc -l))", request);
	}

	@RequestMapping(value = "/restoreWorld", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> restoreWorld(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String world = params.get("world-name");
		System.out.println("echo " + PASSWORD + " | sudo -S ./minecraft/server_restore.sh " + world);
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/server_restore.sh " + world, request);
	}
	
	@RequestMapping(value = "/setCrontab", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> setCrontab(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String cron = params.get("cron");
		System.out.println("echo " + PASSWORD + " | sudo -S ./minecraft/set_crontab.sh " + cron);
//		return executeCommand("ls", request);
		return executeCommand("echo " + PASSWORD + " | sudo -S ./minecraft/set_crontab.sh " + cron, request);
	}
	
	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> authenticate(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		
		if (!(params.containsKey("username") && params.containsKey("password"))) return Utils.postResponse(request, "0", null);
		return Utils.postResponse(request, params.get("username").equals(PUZZLE_USER) && params.get("password").equals(PUZZLE_PASSWORD) ? "1" : "0", null);
	}

	@RequestMapping(value = "/getCurrentWorld", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getCurrentWorld(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		
		return executeCommand("cat minecraft/current_world.txt", request);
	}
	
	@RequestMapping(value = "/getLog", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getLog(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String world = params.get("world") + "-log.txt";
		return executeCommand("cat minecraft/Minecraft/logs/" + world, request);
	}

	@RequestMapping(value = "/getCurrentCron", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getCurrentCron(@RequestParam Map<String, String> params,
			HttpServletRequest request) {

		String command = "echo " + PASSWORD + " | sudo -S ./minecraft/set_crontab.sh -l";

		String status = "GOOD";
		Map<String, Object> data = new HashMap<String, Object>();
		List<String> inputStream = new ArrayList<String>();

		try {

			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch jsch = new JSch();
			Session session = jsch.getSession(USER, HOST, PORT);
			session.setPassword(PASSWORD);
			session.setConfig(config);
			session.connect();

			Channel channel = session.openChannel("exec");
			((ChannelExec) channel).setCommand(command);
			channel.setInputStream(null);
			((ChannelExec) channel).setErrStream(System.err);

			InputStream in = channel.getInputStream();
			channel.connect();
			byte[] tmp = new byte[1024];
			while (true) {
				while (in.available() > 0) {
					int i = in.read(tmp, 0, 1024);
					if (i < 0)
						break;
					inputStream.add(new String(tmp, 0, i));
				}

				data.put("InputStream", inputStream);

				if (channel.isClosed()) {
					data.put("ExitStatus", channel.getExitStatus());
					break;
				}

				try {
					Thread.sleep(500);
				} catch (Exception ee) {
					data.clear();
					status = "Failed to Connect (Error in Thread.sleep)";
				}
			}

			channel.disconnect();
			session.disconnect();
		} catch (Exception e) {
			data.clear();
			status = "Failed to Connect";
		}

		if (status.equals("GOOD"))
			data.put("BackupSchedule", crontabToString(inputStream.get(0)));
		return Utils.postResponse(request, status, data);
	}

	private String crontabToString(String crontab) {
		String[] cron = crontab.split("\n");
		
		if (cron.length < 5) return "N/A";
		
		if (cron[4].equals("*")) {
			return "" + cron[1] + ":00 Daily";
		}

		String day;

		switch (cron[4]) {
		case "0":
			day = "Sundays";
			break;
		case "1":
			day = "Mondays";
			break;
		case "2":
			day = "Tuesdays";
			break;
		case "3":
			day = "Wednesdays";
			break;
		case "4":
			day = "Thursdays";
			break;
		case "5":
			day = "Fridays";
			break;
		case "6":
			day = "Saturdays";
			break;
		default:
			day = "Sundays";
		}

		return day + " at " + cron[1] + ":00";
	}
	
	@RequestMapping(value = "/getLogs", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getLogs(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		
		String status = "GOOD";
		Map<String, Object> data = new HashMap<String, Object>();

		try {
			List<String> inputStream = new ArrayList<String>();

			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch jsch = new JSch();
			Session session = jsch.getSession(USER, HOST, PORT);
			session.setPassword(PASSWORD);
			session.setConfig(config);
			session.connect();

			Channel channel = session.openChannel("exec");
			((ChannelExec) channel).setCommand("echo " + PASSWORD + " | sudo -S ./minecraft/output_logs.sh");
			channel.setInputStream(null);
			((ChannelExec) channel).setErrStream(System.err);

			InputStream in = channel.getInputStream();
			channel.connect();
			byte[] tmp = new byte[1024];
			while (true) {
				while (in.available() > 0) {
					int i = in.read(tmp, 0, 1024);
					if (i < 0)
						break;
					inputStream.add(new String(tmp, 0, i));
				}
				
				data.put("Logs", organizeLogs(inputStream));

				if (channel.isClosed()) {
					data.put("ExitStatus", channel.getExitStatus());
					break;
				}

				try {
					Thread.sleep(500);
				} catch (Exception ee) {
					data.clear();
					status = "Failed to Connect (Error in Thread.sleep)";
				}
			}

			channel.disconnect();
			session.disconnect();
		} catch (Exception e) {
			data.clear();
			status = "Failed to Connect";
		}

		return Utils.postResponse(request, status, data);
	}
	
	private String[] organizeLogs(List<String> logs) {		
		String allLogs = "";
		for (String item : logs) allLogs += item;
		return allLogs.split("EOF");
	}
	
	@RequestMapping(value = "/getAllWorlds", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> getAllWorlds(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String status = "GOOD";
		int exitStatus = 0;
		
		Map<String, Object> data = new HashMap<String, Object>();
		List <String> worlds = executeCommandWithReturn("ls minecraft/world_list");
		
		if (worlds == null) {
			status = "FAILED";
			exitStatus = 1;
		} else {
			data.put("worlds", worlds.get(0).split("\n"));
		}
		
		data.put("ExitStatus", exitStatus);
		
		return Utils.postResponse(request, status, data);
	}
	
	@RequestMapping(value = "/removeWorld", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> removeWorlds(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String status = "GOOD";

		executeCommandWithReturn("echo " + PASSWORD + " | sudo -S ./minecraft/remove_world.sh " + params.get("world"));
		
		return Utils.postResponse(request, status, null);
	}
	
	@RequestMapping(value = "/switchWorld", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> switchWorld(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String status = "GOOD";
		executeCommandWithReturn("echo " + PASSWORD + " | sudo -S ./minecraft/switch_world.sh " + params.get("world"));
		return Utils.postResponse(request, status, null);
	}
	
	@RequestMapping(value = "/createWorld", method = RequestMethod.POST)
	public @ResponseBody Map<String, Object> createWorld(@RequestParam Map<String, String> params,
			HttpServletRequest request) {
		String status = "GREAT";
		executeCommandWithReturn("echo " + PASSWORD + " | sudo -S ./minecraft/create_world.sh " + params.get("world"));
		return Utils.postResponse(request, status, null);
	}
	
	private List<String> executeCommandWithReturn(String command) {
		List<String> inputStream = new ArrayList<String>();
		boolean fail = false;
		try {
			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch jsch = new JSch();
			Session session = jsch.getSession(USER, HOST, PORT);
			session.setPassword(PASSWORD);
			session.setConfig(config);
			session.connect();

			Channel channel = session.openChannel("exec");
			((ChannelExec) channel).setCommand(command);
			channel.setInputStream(null);
			((ChannelExec) channel).setErrStream(System.err);

			InputStream in = channel.getInputStream();
			channel.connect();
			byte[] tmp = new byte[1024];
			while (true) {
				while (in.available() > 0) {
					int i = in.read(tmp, 0, 1024);
					if (i < 0)
						break;
					inputStream.add(new String(tmp, 0, i));
				}

				if (channel.isClosed()) {
					break;
				}

				try {
					Thread.sleep(500);
				} catch (Exception ee) {
					fail = true;
				}
			}

			channel.disconnect();
			session.disconnect();
		} catch (Exception e) {
			fail = true;
		}
		
		return (fail) ? null : inputStream;
	}

	private @ResponseBody Map<String, Object> executeCommand(String command, HttpServletRequest request) {
		String status = "GOOD";
		Map<String, Object> data = new HashMap<String, Object>();

		try {
			List<String> inputStream = new ArrayList<String>();

			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch jsch = new JSch();
			Session session = jsch.getSession(USER, HOST, PORT);
			session.setPassword(PASSWORD);
			session.setConfig(config);
			session.connect();

			Channel channel = session.openChannel("exec");
			((ChannelExec) channel).setCommand(command);
			channel.setInputStream(null);
			((ChannelExec) channel).setErrStream(System.err);

			InputStream in = channel.getInputStream();
			channel.connect();
			byte[] tmp = new byte[1024];
			while (true) {
				while (in.available() > 0) {
					int i = in.read(tmp, 0, 1024);
					if (i < 0)
						break;
					inputStream.add(new String(tmp, 0, i));
				}

				data.put("InputStream", inputStream);

				if (channel.isClosed()) {
					data.put("ExitStatus", channel.getExitStatus());
					break;
				}

				try {
					Thread.sleep(500);
				} catch (Exception ee) {
					data.clear();
					status = "Failed to Connect (Error in Thread.sleep)";
				}
			}

			channel.disconnect();
			session.disconnect();
		} catch (Exception e) {
			data.clear();
			status = "Failed to Connect";
		}

		return Utils.postResponse(request, status, data);
	}
}
