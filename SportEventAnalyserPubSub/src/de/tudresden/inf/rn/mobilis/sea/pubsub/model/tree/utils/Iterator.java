package de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.utils;

import java.util.LinkedList;
import java.util.List;

import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.nodes.interfaces.ItemNode;
import de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.nodes.interfaces.Node;

/**
 * This abstract <code>Iterator</code> implements the
 * <code>java.util.Iterator</code> <code>interface</code> and may be extended to
 * line-up several
 * <code>de.tudresden.inf.rn.mobilis.sea.pubsub.model.tree.utils.Iterable</code>
 * in a protected <code>List</code> (called <code>list</code>). The items of the
 * <code>List</code> then may be iterated
 */
public abstract class Iterator implements java.util.Iterator<Node<?>> {

	/**
	 * A <code>List</code> holding all <code>Iterable</code> <code>Node</code>s
	 */
	protected List<Iterable> list = new LinkedList<Iterable>();

	/**
	 * Counter to determine which is the current <code>Node</code>
	 */
	private int c = 0;

	@Override
	public boolean hasNext() {
		return c < list.size();
	}

	@Override
	public ItemNode<?> next() {
		return (ItemNode<?>) list.get(c++);
	}

	@Override
	public void remove() {
		list.remove(c);
	}

	/**
	 * Resets the <code>Iterator</code> so it may be used again
	 */
	public void reset() {
		list.clear();
		c = 0;
	}

}
