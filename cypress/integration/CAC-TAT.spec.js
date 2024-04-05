/// <reference types="Cypress" />
const THRE_SECONDS_IN_MS = 3000;

beforeEach(() => {
  cy.visit("./src/index.html");
});

describe("Central de Atendimento ao Cliente TAT", () => {
  it("verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText =
      "Me ajuda aê, por favor!A coisa tá feia por aqui. Rola aquele help maroto? Não sei mais o que fazer!!!!!!!";
    cy.clock();

    cy.get('input[name="firstName"]').type("Koi");
    cy.get("#lastName").type("Targaryen");
    cy.get('input[type="email"]').type("koi@targryen.com");
    cy.get('textarea[name="open-text-area"]').type(longText, { delay: 0 });
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();

    cy.get(".success")
      .should("be.visible")
      .contains("Mensagem enviada com sucesso.");
    cy.tick(THRE_SECONDS_IN_MS)
    cy.get(".success")
      .should("not.be.visible")

  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get('input[name="firstName"]').type("Koi");
    cy.get("#lastName").type("Targaryen");
    cy.get('input[type="email"]').type("koitargryen.com");
    cy.get('textarea[name="open-text-area"]').type("Me ajuda aê, por favor");
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();

    cy.get(".error")
      .should("be.visible")
      .contains("Valide os campos obrigatórios!");
    cy.tick(THRE_SECONDS_IN_MS)
    cy.get(".error")
      .should("not.be.visible")
  });

  it("valida que o campo telefone só aceita números", () => {
    cy.get('input[name="firstName"]').type("Koi");
    cy.get("#lastName").type("Targaryen");
    cy.get('input[type="email"]').type("koi@targryen.com");
    cy.get("#phone").type("abc");
    cy.get('input[type="number"]').should("not.have.value");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get('input[name="firstName"]').type("Koi");
    cy.get("#lastName").type("Targaryen");
    cy.get('input[type="email"]').type("koi@targryen.com");
    cy.get('textarea[name="open-text-area"]').type("Me ajuda aê, por favor");
    cy.get('input[value="phone"]').check();
    // cy.get('button[type="submit"]').click();
    cy.contains("button", "Enviar").click();

    cy.get(".error")
      .should("be.visible")
      .contains("Valide os campos obrigatórios!");
    cy.tick(THRE_SECONDS_IN_MS)
    cy.get(".error")
      .should("not.be.visible")
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get('input[name="firstName"]')
      .type("Koi")
      .should("have.value", "Koi")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Targaryen")
      .should("have.value", "Targaryen")
      .clear()
      .should("have.value", "");
    cy.get('input[type="email"]')
      .type("koi@targaryen.com")
      .should("have.value", "koi@targaryen.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("9999999999")
      .should("have.value", "9999999999")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.get('button[type="submit"]').click();

    cy.get(".error")
      .should("be.visible")
      .contains("Valide os campos obrigatórios!");
    cy.tick(THRE_SECONDS_IN_MS)
    cy.get(".error")
      .should("not.be.visible")
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.clock();
    const user = {
      firstName: "Koi",
      lastName: "Targaryen",
      email: "koi@targaryen.com",
      text: "Me ajuda aê, por favor!A coisa tá feia por aqui. Rola aquele help maroto? Não sei mais o que fazer!!!!!!!",
    };
    const message = "Mensagem enviada com sucesso.";

    cy.fillMandatoryFieldsAndSubmit(user, message);
    cy.get(".success").should("be.visible").contains(message);
    cy.tick(THRE_SECONDS_IN_MS)
    cy.get(".success").should("not.be.visible")
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    const product = "mentoria";
    cy.get("#product").select(product).should("have.value", product);
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .check()
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .should("have.length", 2)
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json")
      .then(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .then(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .selectFile('@sampleFile')
      .then(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
  })

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()
    cy.contains('Talking About Testing').should('be.visible')
  })
});
