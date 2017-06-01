package api;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

/**
 * Created by Reinier on 2017-05-31.
 */
public class ApiValidationException extends ApiException {
    public ApiValidationException() {

    }

    public ApiValidationException(String error) {
        super(error);
    }

    public ApiValidationException(List<String> errors) {
        super(StringUtils.join(errors, ", "));
    }
}
