import model.Dot;
import model.DotCollectionManager;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import static java.lang.Math.*;
import static java.time.temporal.ChronoUnit.MINUTES;

@WebServlet(urlPatterns = {"/AreaCheckServlet"}, name = "AreaCheckServlet")
public class AreaCheckServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        float x, y, r;
        PrintWriter printWriter = response.getWriter();
        long timer = System.nanoTime();
        try {
            x = Float.parseFloat(request.getParameter("x_coords").replace(",", "."));
            if(x == -0.0){
                x = 0;
            }
            y = Float.parseFloat(request.getParameter("y_coords").replace(",", "."));
            if(y == -0.0){
                y = 0;
            }
            r = Float.parseFloat(request.getParameter("size_r").replace(",", "."));
        } catch (Exception e) {
            response.setStatus(400);
            response.getWriter().print("x, y, r - must be float");
            return;
        }

//        FilterChain filterChain = (servletRequest, servletResponse) -> {
//
//        };
//
//        Filter52 filter52 = new Filter52();
//        log("Filter created");
//        log(x + " " + y);
//        filter52.doFilter(request, response, filterChain);
//        log("Out of filter status " + response.getStatus());

        if(response.getStatus() != 400 && response.getStatus()/100 != 3) {
            String status = this.checkHit(x, y, r);
            int timezone = Integer.parseInt(request.getParameter("timezone"));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String currentTime = formatter.format(LocalDateTime.now().plus(timezone, MINUTES));
            long scriptTime = (long) ((System.nanoTime()-timer)*0.001);

            Object collection = getServletContext().getAttribute("dots");

            if (collection == null){
                collection = new DotCollectionManager();
            }

            DotCollectionManager dotsCollection = (DotCollectionManager)collection;

            Dot newDot = new Dot(x, y, r, currentTime, scriptTime, status);
            dotsCollection.add(newDot);
            log("Shot successfully added");

            getServletContext().setAttribute("dots", dotsCollection);

            String responseBody = newDot.toJSON();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            printWriter.write(responseBody);
            printWriter.flush();
        }

//        if (response.getStatus() != 400) {
//            LocalDateTime attemptTime = LocalDateTime.now();
//            long scriptStartTime = System.nanoTime();
//            String status = this.checkHit(x, y, r);
//            long scriptEndTime = System.nanoTime();
//            long scriptDuration = (scriptEndTime - scriptStartTime);
//            response.getWriter().print(
//                    "<tr>" +
//                            "<td><p class='crop'>" + x + "</p></td>" +
//                            "<td><p class='crop'>" + y + "</p></td>" +
//                            "<td><p class='crop'>" + r + "</p></td>" +
//                            "<td><p class='crop'>" + status + "</p></td>" +
//                            "<td><p class='crop'>" + attemptTime.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")) + "</p></td>" +
//                            "<td><p class='crop'>" + scriptDuration + "ms </p></td>" +
//                            "</tr>"
//            );
//        }
    }

    private String checkHit(float x, float y, float r) {
        return isRectangle(x,y,r) || isCircle(x,y,r) || isTriangle(x,y,r) ? "Kill" : "Miss";
    }
    private boolean isRectangle(float x, float y, float r) {
        return (x <= 0 && y <=0 && y >= -0.5*x -r/2);
    }
    private boolean isCircle(float x, float y, float r) {
        return (x <= 0 && y >= 0 && pow(x,2) + pow(y, 2) <= pow(r, 2));
    }
    private boolean isTriangle(float x, float y, float r) {
        return (x >=0 && y >= 0 && x <= r && y <= r/2);
    }
}
