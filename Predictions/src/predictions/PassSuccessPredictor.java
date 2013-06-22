package predictions;

import de.core.GameInformation;

public class PassSuccessPredictor implements Predictor {
	public static final String TAG = "[Predictions][PassSuccessPredictor] ";

	private static final int PLAYER_RADIUS = 5;

	private Learner learner;
	private PredictionInstance predictionInstance;

	private int idOfLastPlayerWithBall = -1;

	private int successfulPassesCounter = 0;
	private int failedPassesCounter = 0;

	public PassSuccessPredictor() {
		init();
	}

	@Override
	public void init() {
		predictionInstance = new PassSuccessPredictionInstance();
		learner = new knnLearner(predictionInstance.getHeader());
	}

	@Override
	public void update(GameInformation gameInformation) {
		System.out.println(TAG
				+ " - - - UPDATE: pass success prediction - - - ");

		if (gameInformation.getCurrentBallPossessionPlayer() == null) {
			System.out.println(TAG + "Prediction update failed: no data");
			return;
		}

		int idOfCurrentPlayerWithBall = gameInformation
				.getCurrentBallPossessionPlayer().getId();

		// System.out.println(TAG + "Last player: " + idOfLastPlayerWithBall
		// + " Current player:" + idOfCurrentPlayerWithBall);

		// update instance
		((PassSuccessPredictionInstance) predictionInstance)
				.setAttributes(
						gameInformation.getTeammatesInArea(PLAYER_RADIUS),
						gameInformation.getOpponentsInArea(PLAYER_RADIUS),
						(int) ((float) gameInformation
								.getPlayerPassesSuccessful(idOfLastPlayerWithBall)
								/ ((float) gameInformation
										.getPlayerPassesSuccessful(idOfLastPlayerWithBall) + (float) gameInformation
										.getPlayerPassesMissed(idOfLastPlayerWithBall)) * 100));

		// pass occurred
		if (idOfCurrentPlayerWithBall != idOfLastPlayerWithBall
				&& idOfLastPlayerWithBall != -1) {
			System.out.println(TAG + "A pass occured.");
			train(gameInformation);
		}
		// no pass occurred
		else {
			System.out.println(TAG + "No pass occured.");
			predict(gameInformation);
		}

		idOfLastPlayerWithBall = gameInformation
				.getCurrentBallPossessionPlayer().getId();

	}

	private void predict(GameInformation gameInformation) {
		learner.makePrediction(predictionInstance);

	}

	private void train(GameInformation gameInformation) {

		String result = gameInformation
				.isPlayerLastPassSuccessful(idOfLastPlayerWithBall) ? PassSuccessPredictionInstance.PREDICTION_PASS_SUCCESSFUL
				: PassSuccessPredictionInstance.PREDICTION_PASS_FAILS;

		// count result for comparison with prediction accuracy
		if (result.equals(PassSuccessPredictionInstance.PREDICTION_PASS_FAILS))
			failedPassesCounter++;
		else
			successfulPassesCounter++;

		System.out.println(TAG + "event occured: " + result);

		((PassSuccessPredictionInstance) predictionInstance)
				.setClassAttribute(result);
		
		learner.train(predictionInstance);

		System.out
				.println(TAG
						+ "Successful passes rate = "
						+ ((float) successfulPassesCounter
								/ ((float) successfulPassesCounter + (float) failedPassesCounter) * 100)
						+ "%");


	}

}
