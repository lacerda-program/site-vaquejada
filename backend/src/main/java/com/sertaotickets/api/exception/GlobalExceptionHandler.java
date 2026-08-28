package com.sertaotickets.api.exception;

import jakarta.persistence.OptimisticLockException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

/** Traduz exceção de domínio em resposta HTTP, sempre com o mesmo corpo. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResposta> naoEncontrado(RecursoNaoEncontradoException ex,
                                                      HttpServletRequest req) {
        return montar(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    @ExceptionHandler(EstoqueInsuficienteException.class)
    public ResponseEntity<ErroResposta> estoque(EstoqueInsuficienteException ex,
                                                HttpServletRequest req) {
        return montar(HttpStatus.CONFLICT, ex.getMessage(), req);
    }

    /**
     * Duas compras bateram no mesmo lote. Do ponto de vista do cliente é o mesmo
     * caso de "acabou enquanto você decidia", então responde 409 igual ao estoque.
     */
    @ExceptionHandler({OptimisticLockingFailureException.class, OptimisticLockException.class})
    public ResponseEntity<ErroResposta> concorrencia(Exception ex, HttpServletRequest req) {
        log.warn("Conflito de concorrência na venda: {}", ex.getMessage());
        return montar(HttpStatus.CONFLICT,
                "Outra compra levou esses ingressos primeiro. Tente novamente.", req);
    }

    @ExceptionHandler(PedidoExpiradoException.class)
    public ResponseEntity<ErroResposta> expirado(PedidoExpiradoException ex,
                                                 HttpServletRequest req) {
        return montar(HttpStatus.GONE, ex.getMessage(), req);
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ErroResposta> regra(RegraDeNegocioException ex,
                                              HttpServletRequest req) {
        return montar(HttpStatus.UNPROCESSABLE_CONTENT, ex.getMessage(), req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> validacao(MethodArgumentNotValidException ex,
                                                  HttpServletRequest req) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(erro -> campos.putIfAbsent(erro.getField(), erro.getDefaultMessage()));

        return ResponseEntity.badRequest().body(ErroResposta.comCampos(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Dados inválidos na requisição.",
                req.getRequestURI(),
                campos));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ErroResposta> requisicaoMalFormada(Exception ex, HttpServletRequest req) {
        return montar(HttpStatus.BAD_REQUEST, "Requisição mal formada.", req);
    }

    /**
     * Rede de segurança. O detalhe fica no log do servidor, não na resposta —
     * stack trace em JSON público é vazamento de informação.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> inesperado(Exception ex, HttpServletRequest req) {
        log.error("Erro não tratado em {}", req.getRequestURI(), ex);
        return montar(HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno no servidor. Tente novamente em instantes.", req);
    }

    private ResponseEntity<ErroResposta> montar(HttpStatus status, String mensagem,
                                                HttpServletRequest req) {
        return ResponseEntity.status(status).body(ErroResposta.de(
                status.value(), status.getReasonPhrase(), mensagem, req.getRequestURI()));
    }
}
