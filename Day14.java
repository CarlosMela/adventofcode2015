import java.io.FileReader;
import java.io.BufferedReader;
import java.util.regex.*;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

class Day14 {

  public static void main(String[] args) {
    String line;
    BufferedReader input;
    ArrayList<Reindeer> allReindeers = new ArrayList<Reindeer>();
    Pattern p = Pattern.compile("/(\\d+)/g");
    try{
      input = new BufferedReader(new FileReader("input14.txt"));
      line = input.readLine();
      while(line != null){
        allReindeers.add(Day14.parseLine(line));
        line = input.readLine();
      }
    }catch(Exception e){
      System.out.println("My exception Day13");
      e.printStackTrace();
    }

    System.out.println(Day14.race(allReindeers,2503));

    for(Reindeer reindeer: allReindeers){
      reindeer.reset();
    }

    System.out.println(Day14.pointsRace(allReindeers,2503));
  }

  public static int race(ArrayList<Reindeer> reindeers,int time){
    for (Reindeer reindeer: reindeers){
      reindeer.fly(time);
    }
    return reindeers.stream().mapToInt(r -> r.getDistance()).reduce(0,(a,b)-> Math.max(a,b));
  }

  public static int pointsRace(ArrayList<Reindeer> reindeers,int time){
    HashMap<Reindeer,Integer> scores = new HashMap<Reindeer,Integer>();
    int leaderDistance;
    ArrayList<Reindeer> leaders;
    //initialize points
    for (Reindeer reindeer: reindeers){
      scores.put(reindeer,0);
    }
    for(int i =0; i<time;i++){
      //everyone fly one second
      for (Reindeer reindeer: reindeers){
        reindeer.fly(1);
      }

      //Doesn't work, leader is not unique
      // leader = reindeers.stream().reduce(new Reindeer(0,0,0),(a,b)-> a.getDistance()>b.getDistance()?a:b);
      leaderDistance = reindeers.stream().mapToInt(r -> r.getDistance()).reduce(0,(a,b)-> Math.max(a,b));

      //All leaders score
      for (Reindeer reindeer: reindeers){
        if(reindeer.getDistance()==leaderDistance){
          scores.put(reindeer,scores.get(reindeer)+1);
        }
      }
    }
    return scores.values().stream().reduce(0,(a,b)-> Math.max(a,b));
  }

  public static Reindeer parseLine(String line){
    int speed = 0, length = 0, recovery = 0;
    String regex = "\\d+";
    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(line);
    m.find();
    speed = Integer.parseInt(m.group());
    m.find();
    length = Integer.parseInt(m.group());
    m.find();
    recovery = Integer.parseInt(m.group());

    return new Reindeer(speed,length,recovery);
  }
}

class Reindeer {
  private int distance;
  private int rested;
  private int flyed;
  private int speed;
  private int maxFlyLength;
  private int recoveryTime;
  Reindeer(int speed, int maxFlyLength, int recoveryTime){
    this.distance = 0;
    this.rested = 0;
    this.flyed = 0;
    this.speed = speed;
    this.maxFlyLength = maxFlyLength;
    this.recoveryTime = recoveryTime;
  }

  public void fly(int time){
    for(int i=0;i<time;i++){
      if(this.flyed<this.maxFlyLength){
        this.flyed++;
        this.distance += this.speed;
      }else if(this.rested < this.recoveryTime){
        this.rested++;
      }else{
        this.distance += this.speed;
        this.flyed = 1;
        this.rested = 0;
      }
    }
  }

  public int getDistance(){
    return this.distance;
  }

  public void reset(){
    this.distance = 0;
    this.rested = 0;
    this.flyed = 0;
  }

  public String toString(){
    return this.speed + " " + this.maxFlyLength + " " + this.recoveryTime;
  }
}
