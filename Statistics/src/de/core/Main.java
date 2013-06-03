package de.core;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import de.esper.EsperTest;

/**
 * Auslesen vonner Megadatei f�r ein Programm, welches es eigentlich schon vom Fraunhofer gibt
 * 
 * @author Alrik Geselle
 * @version 1.0
 */
public class Main
{
	private ExecutorService executor = Executors.newFixedThreadPool(4);
	private EventDecoder eventDecoder;
	private EsperTest esperTest = new EsperTest();
	public static Main main;
	private int ballPosX = 0;
	private int ballPosY = 0;

	public int currentBallPossessionId = 0;
	public final static float ballPossessionThreshold = 1000f; // 1000mm = 1m

	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		main = new Main();

		// main.test2();
		main.test();
	}

	public void test2()
	{
		GZipReader reader;
		String[] data;
		String[] name;

		try
		{
			reader = new GZipReader("referee-events1.tar.gz");

			int lines = 1000000;

			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
			dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
			Date date;

			for (int i = 0; i < lines; i++)
			{
				data = reader.readNextCsvLine();

				if (data == null)
				{
					break;
				}

				if (data.length == 5 && Utils.isNumeric(data[0]))
				{
					try
					{
						int eventNumber = Integer.parseInt(data[0]);

						if (eventNumber != 6014 && eventNumber != 6015)
						{
							continue;
						}

						name = data[1].replace("\"", "").split("\\s* \\s*");
						date = dateFormat.parse("1970-01-01 " + data[2]);

						if (name.length > 2)
						{
							// esperTest.getCepRT().sendEvent(new EventBallPossession(name[0] + " " + name[1], (10629342490369879L +
							// date.getTime()), name[2]));
							esperTest.getCepRT().sendEvent(new EventBallPossession("shit", 102, "homo"));
						}
					}
					catch (ParseException e)
					{
						System.out.println(e.getMessage());
					}
				}
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}

		System.out.println("============================================");
		esperTest.ballPossession(1);

	}

	public void test()
	{

		eventDecoder = new EventDecoder(esperTest.getCepRT());

		// get sensor id 47 from the past 30sek
		// esperTest.getSensorId(47, 300);

		// start decoding the file
		// eventDecoder.decode(100, "full-game.gz");

		// start decoding the file async
		Callable<Void> c = new CallableDecode(eventDecoder, 100000000, "full-game.gz");
		executor.submit(c);

		System.out.println("============================================");

		// esperTest.getAllFromSensorId(47, 1); // the past 30 seconds
		// int[] playerIds = { 47, 49, 19, 53, 23, 57, 59, 63, 65, 67, 69, 71, 73, 75 };
		int[] playerIds = { 47, 16, 49, 88, 19, 52, 53, 54, 23, 24, 57, 58, 59, 28, 63, 64, 65, 66, 67, 68, 69, 38, 71, 40, 73, 74, 75, 44 };
		for (int player : playerIds)
		{
			esperTest.getAllFromSensorId(player, 100);
		}
		esperTest.getAllFromSensorId(4, 100); // Ball every 100ms
		// esperTest.getTimedFromSensorId(47, 10); //

	}

	public EventDecoder getEventDecoder()
	{
		return eventDecoder;
	}

	public Entity getEntityFromId(int id)
	{
		if (getEventDecoder().getEntityList().containsKey(id))
		{
			return getEventDecoder().getEntityList().get(id);
		}

		return null;
	}

	public int getBallPosX()
	{
		return ballPosX;
	}

	public void setBallPosX(int posX)
	{
		this.ballPosX = posX;
	}

	public int getBallPosY()
	{
		return ballPosY;
	}

	public void setBallPosY(int posY)
	{
		this.ballPosY = posY;
	}

	class CallableDecode implements Callable<Void>
	{
		EventDecoder eventDecoder;
		int lines;
		String filePath;

		public CallableDecode(EventDecoder eventDecoder, int lines, String filePath)
		{
			this.eventDecoder = eventDecoder;
			this.lines = lines;
			this.filePath = filePath;
		}

		@Override
		public Void call() throws Exception
		{
			eventDecoder.decode(lines, filePath);
			return null;
		}
	}
}