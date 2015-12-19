import java.io.FileReader;
import java.io.BufferedReader;
import java.util.regex.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.HashMap;
import java.util.stream.Collectors;

class Day16 {
  public static void main(String[] args) {
    String line = "";
    BufferedReader input;
    List<String> allAuntSue = new ArrayList<String>();
    String[] arrayC = { "children: 3",
                        "cats: 7",
                        "samoyeds: 2",
                        "pomeranians: 3",
                        "akitas: 0",
                        "vizslas: 0",
                        "goldfish: 5",
                        "trees: 3",
                        "cars: 2",
                        "perfumes: 1" };
    ArrayList<String> compounds = new ArrayList<String>(Arrays.asList(arrayC));

    try{
      input = new BufferedReader(new FileReader("input16.txt"));
      line = input.readLine();
      while(line != null){
        allAuntSue.add(line);
        line = input.readLine();
      }
    }catch(Exception e){
      System.out.println("My exception Day16");
      e.printStackTrace();
    }

    Day16.SOLUTION1(allAuntSue,compounds);
    Day16.SOLUTION2(allAuntSue,compounds);
  }

  public static void SOLUTION1(List<String> allAuntSue,List<String> compounds){
    for(String ingredient : compounds){
      allAuntSue = allAuntSue.stream().filter(r->Day16.exactOrMissing(ingredient,r)).collect(Collectors.toList());
    }
    allAuntSue.stream().forEach(s -> System.out.println(s));
  }

  public static void SOLUTION2(List<String> allAuntSue,List<String> compounds){
    for(String ingredient : compounds){
      allAuntSue = allAuntSue.stream().filter(r->Day16.passFilter(ingredient,r)).collect(Collectors.toList());
    }
    allAuntSue.stream().forEach(s -> System.out.println(s));
  }

  public static Boolean passFilter(String ingredient,String row){
    Boolean pass = false;
    Ingredient ingr = Day16.parseIngredient(ingredient);
    String name = ingr.getName();
    if("cats".equals(name) || "trees".equals(name)){
      pass = Day16.greaterThan(ingr,row);
    }else if("pomeranians".equals(name) || "goldfish".equals(name)){
      pass = Day16.fewerThan(ingr,row);
    }else{
      pass = Day16.exactOrMissing(ingredient,row);
    }
    return pass;
  }

  public static Ingredient parseIngredient(String ingredient){
    String name = null;
    Integer value = null;
    Pattern pattern1 = Pattern.compile("(^\\w+): (\\d+)");
    Matcher regexMatcher = pattern1.matcher(ingredient);
    if (regexMatcher.find()) {
        name = regexMatcher.group(1);
        value = Integer.parseInt(regexMatcher.group(2));
    }
    return new Ingredient(name,value);
  }

  public static Integer getQuantity(Ingredient ingredient,String row){
    String name = ingredient.getName();
    Integer value = ingredient.getValue();

    String regex = ".*"+name+": (\\d+).*|^((?!( "+name+":)).)*$";
    Pattern p = Pattern.compile(regex);
    Matcher m = p.matcher(row);
    String result = "nada";
    if (m.find()) {
        result = m.group(1);
    }
    if(result != null){
      return Integer.parseInt(result);
    }
    return null;
  }

  public static Boolean greaterThan(Ingredient ingredient,String row){
    Boolean result = false;
    Integer quantity = Day16.getQuantity(ingredient,row);
    if(quantity==null || quantity>ingredient.getValue()){
      result = true;
    }
    return result;
  }

  public static Boolean fewerThan(Ingredient ingredient,String row){
    Boolean result = false;
    Integer quantity = Day16.getQuantity(ingredient,row);
    if(quantity==null || quantity<ingredient.getValue()){
      result = true;
    }
    return result;
  }

  public static Boolean exactOrMissing(String ingredient,String row){
    String name = "";
    Pattern pattern1 = Pattern.compile("^\\w+:");
    Matcher regexMatcher = pattern1.matcher(ingredient);
    if (regexMatcher.find()) {
        name = regexMatcher.group(0);
    }
    //regex: exact number or not present
    String regex = ".*"+ingredient+".*|^((?!("+name+")).)*$";
    Pattern p = Pattern.compile(regex);
    return p.matcher(row).lookingAt();
  }

  // public static void SOLUTION1(List<String> allAuntSue,List<String> compounds){
  //   for(String ingredient : compounds){
  //     String resultString = "";
  //     Pattern regex1 = Pattern.compile("^\\w+:");
  //     Matcher regexMatcher = regex1.matcher(ingredient);
  //     if (regexMatcher.find()) {
  //         resultString = regexMatcher.group(0);
  //     }
  //     //regex: exact number or not present
  //     String regex = ".*"+ingredient+".*|^((?!( "+resultString+")).)*$";
  //     Pattern p = Pattern.compile(regex);
  //     allAuntSue = allAuntSue.stream().filter(r -> p.matcher(r).lookingAt()).collect(Collectors.toList());
  //   }
  //   allAuntSue.stream().forEach(s -> System.out.println(s));
  // }
}

class Ingredient {
   private String name;
   private Integer value;

   public Ingredient(String name, Integer value) {
       this.name= name;
       this.value= value;
  }

  public String getName(){
    return this.name;
  }

  public Integer getValue(){
    return this.value;
  }

  public String toString(){
    return "(Ingredient)"+this.name +": " + this.value;
  }
}
