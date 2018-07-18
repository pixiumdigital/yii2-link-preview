<?php

use yii\db\Migration;

/**
 * Class m180718_072711_alter_link_preview
 */
class m180718_072711_alter_link_preview extends Migration
{
  public function up()
  {
    $this->addColumn('link_preview', 'tags', $this->text()->after('image'));
  }

  public function down()
  {
    $this->dropColumn('link_preview', 'tags');
  }
}
