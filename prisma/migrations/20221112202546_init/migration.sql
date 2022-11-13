-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "passwordHash" TEXT NOT NULL,
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "userId" TEXT NOT NULL,
    "role" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "assignToNewUsers" BOOLEAN NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL,
    "entityId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "tenantId" TEXT,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "company" TEXT,
    "selectedSubscriptionPriceId" TEXT,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnAuthor" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "LearnAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "color" INTEGER NOT NULL,

    CONSTRAINT "LearnCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "color" INTEGER NOT NULL,

    CONSTRAINT "LearnTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnPostTag" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "LearnPostTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnPost" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "pricingModel" INTEGER,
    "stripeId" TEXT,
    "badge" TEXT,

    CONSTRAINT "LearnPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBooklet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBooklet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learnPostId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "subscriptionPriceId" TEXT,
    "quantity" INTEGER,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundAddress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "InboundAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "InboundAddressId" TEXT,
    "messageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT NOT NULL,
    "toName" TEXT,
    "textBody" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailRead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmailRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCc" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "toName" TEXT,

    CONSTRAINT "EmailCc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailAttachment" (
    "id" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "length" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "publicUrl" TEXT,
    "storageBucket" TEXT,
    "storageProvider" TEXT,

    CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPrice" (
    "id" TEXT NOT NULL,
    "subscriptionProductId" TEXT NOT NULL,
    "stripeId" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "billingPeriod" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "trialDays" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "SubscriptionPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionFeature" (
    "id" TEXT NOT NULL,
    "subscriptionProductId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "SubscriptionFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionClass" (
    "id" SERIAL NOT NULL,
    "successorId" INTEGER,
    "isRoot" BOOLEAN NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "total" INTEGER,
    "cumulative" INTEGER,
    "waiting" INTEGER,
    "rejected" INTEGER,
    "obsolote" INTEGER,

    CONSTRAINT "QuestionClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "summary" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_userId_key" ON "AdminUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_tenantId_key" ON "UserRole"("userId", "roleId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_email_key" ON "Registration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_token_key" ON "Registration"("token");

-- CreateIndex
CREATE UNIQUE INDEX "LearnAuthor_slug_key" ON "LearnAuthor"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearnCategory_name_key" ON "LearnCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LearnTag_name_key" ON "LearnTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LearnPost_slug_key" ON "LearnPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "InboundAddress_address_key" ON "InboundAddress"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Email_messageId_key" ON "Email"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionClass_successorId_key" ON "QuestionClass"("successorId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnPostTag" ADD CONSTRAINT "LearnPostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "LearnPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnPostTag" ADD CONSTRAINT "LearnPostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "LearnTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnPost" ADD CONSTRAINT "LearnPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "LearnAuthor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnPost" ADD CONSTRAINT "LearnPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "LearnCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBooklet" ADD CONSTRAINT "UserBooklet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_learnPostId_fkey" FOREIGN KEY ("learnPostId") REFERENCES "LearnPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_subscriptionPriceId_fkey" FOREIGN KEY ("subscriptionPriceId") REFERENCES "SubscriptionPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundAddress" ADD CONSTRAINT "InboundAddress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_InboundAddressId_fkey" FOREIGN KEY ("InboundAddressId") REFERENCES "InboundAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailRead" ADD CONSTRAINT "EmailRead_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailRead" ADD CONSTRAINT "EmailRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCc" ADD CONSTRAINT "EmailCc_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Email"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionPrice" ADD CONSTRAINT "SubscriptionPrice_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "LearnPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionFeature" ADD CONSTRAINT "SubscriptionFeature_subscriptionProductId_fkey" FOREIGN KEY ("subscriptionProductId") REFERENCES "LearnPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionClass" ADD CONSTRAINT "QuestionClass_successorId_fkey" FOREIGN KEY ("successorId") REFERENCES "QuestionClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
