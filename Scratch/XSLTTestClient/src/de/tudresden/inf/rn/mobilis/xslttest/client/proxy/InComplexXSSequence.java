package de.tudresden.inf.rn.mobilis.xslttest.client.proxy;

import java.util.ArrayList;
import java.util.List;

import org.xmlpull.v1.XmlPullParser;

import de.tudresden.inf.rn.mobilis.xmpp.beans.XMPPInfo;

public class InComplexXSSequence implements XMPPInfo {

	private List< Long > inSeq = new ArrayList< Long >();


	public InComplexXSSequence( List< Long > inSeq ) {
		super();
		for ( long entity : inSeq ) {
			this.inSeq.add( entity );
		}
	}

	public InComplexXSSequence(){}



	@Override
	public void fromXML( XmlPullParser parser ) throws Exception {
		boolean done = false;
			
		do {
			switch (parser.getEventType()) {
			case XmlPullParser.START_TAG:
				String tagName = parser.getName();
				
				if (tagName.equals(getChildElement())) {
					parser.next();
				}
				else if (tagName.equals( "inSeq" ) ) {
					inSeq.add( Long.parseLong( parser.nextText() ) );
				}
				else
					parser.next();
				break;
			case XmlPullParser.END_TAG:
				if (parser.getName().equals(getChildElement()))
					done = true;
				else
					parser.next();
				break;
			case XmlPullParser.END_DOCUMENT:
				done = true;
				break;
			default:
				parser.next();
			}
		} while (!done);
	}

	public static final String CHILD_ELEMENT = "InComplexXSSequence";

	@Override
	public String getChildElement() {
		return CHILD_ELEMENT;
	}

	public static final String NAMESPACE = "http://mobilis.inf.tu-dresden.de#services/XSLTTestService#type:InComplexXSSequence";

	@Override
	public String getNamespace() {
		return NAMESPACE;
	}

	@Override
	public String toXML() {
		StringBuilder sb = new StringBuilder();

		for( long entry : this.inSeq ) {
			sb.append( "<inSeq>" );
			sb.append( entry );
			sb.append( "</inSeq>" );
		}

		return sb.toString();
	}



	public List< Long > getInSeq() {
		return this.inSeq;
	}

	public void setInSeq( List< Long > inSeq ) {
		this.inSeq = inSeq;
	}

}