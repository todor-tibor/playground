import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class PlaygroundTest {
    
    @Test
    public void testPG(){
        Playground pg = new Playground();
        String res = pg.playGround();
        assertEquals("PG", res);
    }
}
