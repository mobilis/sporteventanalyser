package de.tudresden.inf.rn.mobilis.sea.pubsub.model.visitor.interfaces;

import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.StatisticCollection;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentGameData;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentHeatMapData;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentPlayerData;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentPositionData;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentPrognosisData;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.leaves.impl.CurrentTeamData;

/**
 * This interface declares several concrete methods which a concrete
 * <code>Visitor</code> must implement to access the PubSub-model
 */
public interface Visitor {

	/**
	 * Visit a <code>StatisticCollection</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>StatisticCollection</code> <code>Node</code>
	 */
	public void visit(StatisticCollection node);

	/**
	 * Visit a <code>CurrentPositionData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentPositionData</code> <code>Node</code>
	 */
	public void visit(CurrentPositionData node);

	/**
	 * Visit a <code>CurrentPlayerData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentPlayerData</code> <code>Node</code>
	 */
	public void visit(CurrentPlayerData node);

	/**
	 * Visit a <code>CurrentTeamData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentTeamData</code> <code>Node</code>
	 */
	public void visit(CurrentTeamData node);

	/**
	 * Visit a <code>CurrentHeatMapData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentHeatMapData</code> <code>Node</code>
	 */
	public void visit(CurrentHeatMapData node);

	/**
	 * Visit a <code>CurrentPrognosisData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentPrognosisData</code> <code>Node</code>
	 */
	public void visit(CurrentPrognosisData node);

	/**
	 * Visit a <code>CurrentGameData</code> <code>Node</code>
	 * 
	 * @param node
	 *            the <code>CurrentGameData</code> <code>Node</code>
	 */
	public void visit(CurrentGameData node);
}
