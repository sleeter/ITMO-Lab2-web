import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebFilter(filterName = "Filter52", servletNames = {"AreaCheckServlet"}, urlPatterns = {"/AreaCheckServlet"})
public class Filter52 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        Float x, y;
        Logger logger = Logger.getLogger(Filter52.class.getName());
        logger.log(Level.INFO, "In doFilter");
        x = Float.parseFloat(servletRequest.getParameter("x_coords").replace(",", "."));
        y = Float.parseFloat(servletRequest.getParameter("y_coords").replace(",", "."));
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if (x.compareTo(0.52f)==0 || y.compareTo(0.52f) == 0) {
            logger.log(Level.INFO, x + " " + y);
            logger.log(Level.INFO, "x or y is 0.52");
//            String url = request.getContextPath() + "/text.jsp";
//            logger.log(Level.INFO, "url is " + url);
            logger.log(Level.INFO, "forward below");
//            request.getServletContext().getRequestDispatcher(url).forward(request,response);
            response.sendRedirect("https://vk.com/alblakhome");
            logger.log(Level.INFO, "after forward status " + response.getStatus());
        } else {
            filterChain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {

    }
}
