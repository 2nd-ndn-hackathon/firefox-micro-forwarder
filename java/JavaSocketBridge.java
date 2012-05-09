// @author: ucla-cs


import java.applet.*;
import javax.swing.*;
import netscape.javascript.*;

import java.net.*;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.concurrent.ConcurrentHashMap;
import java.io.*;

public class JavaSocketBridge extends JApplet {

	private final static int PACKETSIZE = 3000 ;
	// Instance variables
	static JSObject browser = null;		// The browser

	static ConcurrentHashMap hm = null;

	// Initialize
	public void init(){
		browser = JSObject.getWindow(this);
	}

	public String connectAndStart(final String ip, final int por, final String interest){
		return AccessController.doPrivileged(
				new PrivilegedAction<String>() {
					public String run() {

						DatagramSocket socket = null ;
						byte[] output = null;
						try
						{
							// Convert the arguments first, to ensure that they are valid
							InetAddress host = InetAddress.getByName( ip ) ;
							int port = por ;

							// Construct the socket
							socket = new DatagramSocket() ;


							byte [] data = hex2Byte(interest);
							DatagramPacket packet = new DatagramPacket( data, data.length, host, port ) ;

							// Send it
							socket.send( packet ) ;

							// Set a receive timeout, 2000 milliseconds
							socket.setSoTimeout( 4000 ) ;

							// Prepare the packet for receive
							packet.setData( new byte[PACKETSIZE] ) ;

							// Wait for a response from the server
							socket.receive( packet ) ;

							// Print the response
							output = packet.getData() ;

						}
						catch( Exception e )
						{
							error(e.toString());
							System.out.println( e ) ;
						}
						finally
						{
							if( socket != null )
								socket.close() ;
						}

						if(output!=null)
							return byte2hex(output);
						else 
							return "";
					}
				}
				);

	}

	public String sendContentObject(final String ip, final int por, final String interest){
		return AccessController.doPrivileged(
				new PrivilegedAction<String>() {
					public String run() {

						DatagramSocket socket = null ;
						byte[] output = null;
						try
						{
							// Convert the arguments first, to ensure that they are valid
							InetAddress host = InetAddress.getByName( ip ) ;
							int port = por ;

							// Construct the socket
							socket = new DatagramSocket() ;


							byte [] data = hex2Byte(interest);
							DatagramPacket packet = new DatagramPacket( data, data.length, host, port ) ;

							// Send it
							socket.send( packet );
						}
						catch( Exception e )
						{
							error(e.toString());
							System.out.println( e ) ;
						}
						finally
						{
							if( socket != null )
								socket.close() ;
						}

						if(output!=null)
							return byte2hex(output);
						else 
							return "";
					}
				}
				);

	}

	public static byte[] hex2Byte(String str)
	{
		byte[] bytes = new byte[str.length() / 2];
		for (int i = 0; i < bytes.length; i++)
		{
			bytes[i] = (byte) Integer
					.parseInt(str.substring(2 * i, 2 * i + 2), 16);
		}

		return bytes;
	}
	public static String byte2hex(byte[] b)
	{
		// String Buffer can be used instead
		String hs = "";
		String stmp = "";

		for (int n = 0; n < b.length; n++)
		{
			stmp = (java.lang.Integer.toHexString(b[n] & 0XFF));

			if (stmp.length() == 1)
			{
				hs = hs + "0" + stmp;
			}
			else
			{
				hs = hs + stmp;
			}

			if (n < b.length - 1)
			{
				hs = hs + "";
			}
		}

		return hs;
	}


	// Main
	// Note: This method loops over and over to handle requests becuase only
	//       this thread gets the elevated security policy.  Java == stupid.
	public void start(){
		try {
			browser.call("java_socket_bridge_ready", null);
		} catch (JSException e) {
			// TODO Auto-generated catch block
			error(e.getMessage());
		}

	}


	// Report an error
	public static void error(String message){
		message = "Java Socket Bridge ERROR: " + message;
		Object[] arguments = new Object[1];
		arguments[0] = message;
		try {
			browser.call("on_socket_error", arguments);
		} catch (JSException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// Report an error
	public static void receivedInterest(String IP,int port, byte[] data){


		Object[] arguments = new Object[3];
		arguments[0] = IP;
		arguments[1] = port;
		arguments[2] = byte2hex( data );

		try {
			browser.call("on_socket_received_interest", arguments);
		} catch (JSException e) {
			// TODO Auto-generated catch block
			error(e.getMessage());
		}

	}


	public static void connectAndStartAndPublish() 
	{

		AccessController.doPrivileged(
				new PrivilegedAction<String>() {
					public String run() {
						Thread t = new Thread( new Runnable(){
							public void run(){


								String message; 
								try{
									DatagramSocket serverSocket = new DatagramSocket(9876);
									byte[] receiveData = new byte[1024];
									byte[] sendData = new byte[1024];
									while(true)
									{
										DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
										serverSocket.receive(receivePacket);

										//String sentence = new String( receivePacket.getData());

										//System.out.println("RECEIVED: " + sentence);


										InetAddress IPAddress = receivePacket.getAddress();

										int port = receivePacket.getPort();

										byte[] receivedData = receivePacket.getData();

										receivedInterest( IPAddress.getHostAddress() , port, receivedData);

										//String capitalizedSentence = sentence.toUpperCase();

										//DATA PACKET HERE!


										//sendData = capitalizedSentence.getBytes();

										//DatagramPacket sendPacket =
										//	new DatagramPacket(sendData, sendData.length, IPAddress, port);
										//serverSocket.send(sendPacket);
									}
								}
								catch(Exception e){
									error("Exception " + e + "FAILURE, ERROR IN SOCKET CONECTION");
								}


							}
						});

						t.start();
						return "SUCCESS";


					}


				}
				);

	}

}